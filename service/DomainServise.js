class DomainServise {
  validateDomain(domain, expectedDomain){
    if(!domain || !expectedDomain) return false;

    return String(domain).replace(/\\\//gi, '') === String(expectedDomain);
  }
}

module.exports = {
  domainServise: new DomainServise()
}