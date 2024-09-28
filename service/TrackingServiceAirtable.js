const Airtable = require("airtable");

class TrackingServiseAirtable {
    #base = new Airtable({apiKey: process.env.AIRTABLE_API_TOKEN}).base(process.env.AIRTABLE_BASE_ID);

    async getAllDomainPixels(uaid){
        const clients = await this.getClients(uaid);
        const vendors = await this.getVendors(clients);
        const clientVendors = await this.getClientVendors(uaid, vendors);

        return clientVendors.map(cv => ({
            "name": cv.name,
            "uaid": cv.uaid,
            "domain": this.#getClientVendorDomain(cv, clients),
            "script": this.#createClientVendorScript(cv, vendors)
        }));

    }

    getClients(uaid){
        const result = [];
        const clientPages = this.#base("Clients").select({
            // Selecting the first 3 records in Grid view:
            // maxRecords: 3,
            view: "Grid view",
            fields: ["Name", "Domain", "UAID", "Date Created", "Client-Vendor", "Leads Amount"],
            // filterByFormula: `{UAID}=\"ua-boyzctgl-1727-ofg7-boyzctglofg7b4\"`,
            filterByFormula: `{UAID}="${uaid}"`
        });

        return new Promise((res, rej) => {
            clientPages
                .eachPage(function page(records, fetchNextPage) {
                    // This function (`page`) will get called for each page of records.
                    records.forEach(function(record) {
                        result.push({
                            "clientId": record.getId(),
                            "name": record.get("Name"),
                            "domain": record.get("Domain"),
                            "uaid": record.get("UAID"),
                            "clientVendor": record.get("Client-Vendor"),
                            "leadsAmount": record.get("Leads Amount"),
                            "dateCreated": record.get("Date Created"),
                        });
                    });
                
                    // To fetch the next page of records, call `fetchNextPage`.
                    // If there are more records, `page` will get called again.
                    // If there are no more records, `done` will get called.
                    fetchNextPage();

                    return res(result);
                
                }, function done(err) {
                    if (err) { 
                        console.error(err); 
                        // throw err;
                        return rej(err); 
                    }
                });
        });

    }

    async getVendors(clients){
        const $this = this;
        const result = [];
        const allClientsVendors = clients.map(client => client.clientVendor).flat();

        const vendorsPages = this.#base("Vendors").select({
            // Selecting the first 3 records in Grid view:
            // maxRecords: 3,
            view: "Grid view",
            fields: ["Name", "Status", "script_url", "Connection schema","Client-Vendor"],
            filterByFormula: `AND({Status}="On")`
            // filterByFormula: `SEARCH("recRnTlLc69MW9j1N", ARRAYJOIN({Client-Vendor}))`
            // filterByFormula: `AND({Status}="On", OR(${allVendors.map(vendor => "{Client-Vendor}=" + "\"" + vendor + "\"")}))`
        });

        return new Promise((res, rej) => {
            vendorsPages
                .eachPage(function page(records, fetchNextPage) {
                    // This function (`page`) will get called for each page of records.
                
                    records.forEach(function(record) {
                        result.push({
                            "vendorId": record.getId(),
                            "name": record.get("Name"),
                            "status": record.get("Status"),
                            "scriptUrl": record.get("script_url"),
                            "connectionSchema": record.get("Connection schema"),
                            "clientVendor": record.get("Client-Vendor")
                        });
                    });
                
                    // To fetch the next page of records, call `fetchNextPage`.
                    // If there are more records, `page` will get called again.
                    // If there are no more records, `done` will get called.
                    fetchNextPage();

                    const filteredResult = $this.#filterVendorsByClients(result, allClientsVendors);
                    return res(filteredResult);
                
                }, function done(err) {
                    if (err) { 
                        console.error(err); 
                        return rej(err); 
                    }
                });
        });
    }

    getClientVendors(uaid, vendors){
        const $this = this;
        const result = [];
        const clientVendorPages = this.#base("Client-Vendor").select({
            // Selecting the first 3 records in Grid view:
            // maxRecords: 3,
            view: "Grid view",
            fields: ["Name", "Client", "Vendors", "Status","Vendor-ID", "UAID"],
            filterByFormula: `AND({UAID}="${uaid}", {Status}="On")`
        });

        return new Promise((res, rej) => {
            clientVendorPages
            .eachPage(function page(records, fetchNextPage) {
                // This function (`page`) will get called for each page of records.
            
                records.forEach(function(record) {
                    result.push({
                        "name": record.get("Name"),
                        "status": record.get("Status"),
                        "client": record.get("Client"),
                        "vendor": record.get("Vendors"),
                        "vendorId": record.get("Vendor-ID"),
                        "uaid": record.get("UAID"),
                    });
                });
            
                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();

                const filteredResult = $this.#filterEnabledClientVendors(vendors, result);
                return res(filteredResult);

                // return res(result);
            
            }, function done(err) {
                if (err) { 
                    console.error(err); 
                    return rej(err); 
                }
            });
        })
    }

    #createClientVendorScript(cv, vendors){
        const replacementMap = {
            "Vendors": "vendor",
            "Client-Vendor": "cv",
            "script_url": "scriptUrl",
            "Vendor-ID": "vendorId"
        };
        const regex = /\{\{([A-Za-z0-9-_]+)\.([A-Za-z0-9-_]+)\}\}/g;
        const vendor = vendors.find(vendor => vendor.vendorId === cv.vendor[0]);
        const dataObj = {
            cv, 
            vendor
        };
        const script = vendor.connectionSchema.replace(regex, replacer);

        function replacer(match, p1, p2){
            return dataObj?.[replacementMap[p1] || p1]?.[replacementMap[p2] || p2];
        }

        return script;
    }

    #filterEnabledClientVendors(vendors, clientVendors){
        const result = [];
        clientVendors.forEach(cv => {
            vendors.forEach(vendor => {
                if(
                    vendor.status.toLowerCase() === "on" && 
                    cv.vendor[0] === vendor.vendorId && 
                    !(result.find(resultClientVendor => resultClientVendor.name === cv.name))
                ) {
                    result.push(cv);
                }
            });
        });

        return result;
    }

    #filterVendorsByClients(vendors, allClientsVendors){
        const result = [];
        vendors.forEach(vendor => {
            allClientsVendors.forEach(acv => {
                if(
                    vendor.clientVendor.includes(acv) && 
                    !(result.find(resultVendor => resultVendor.name === vendor.name))
                ) {
                    result.push(vendor);
                }
            })
        });

        return result;
    }

    #getClientVendorDomain(cv, clients){
        const client = clients.find(client => client.clientId === cv.client[0]);

        return client.domain;
    }
}

module.exports = {
  trackingServiseAirtable: new TrackingServiseAirtable()
}