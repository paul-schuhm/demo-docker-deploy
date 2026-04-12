function createUserService(repository) {
  return {
    async users() {
      return repository.findAll();
    },
  };
}

module.exports = { createUserService };
