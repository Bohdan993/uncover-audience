class DomainServise {
  validateDomain(domain, expectedDomain){
    if(!domain || !expectedDomain) return false;
    console.log("Domain: ", String(domain).replace(/(^\w+:|^)|\//gi, ''));
    console.log("Expected domain: ", String(expectedDomain).replace(/(^\w+:|^)|\//gi, ''));
    return String(domain).replace(/(^\w+:|^)|\//gi, '') === String(expectedDomain).replace(/(^\w+:|^)|\//gi, '');
  }
}

module.exports = {
  domainServise: new DomainServise()
}