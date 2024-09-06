class DomainServise {
  validateDomain(domain, expectedDomain){
    if(!domain || !expectedDomain) return false;

    return String(domain).replace(/(^\w+:|^)|\//gi, '') === String(expectedDomain).replace(/(^\w+:|^)|\//gi, '');
  }
}

module.exports = {
  domainServise: new DomainServise()
}