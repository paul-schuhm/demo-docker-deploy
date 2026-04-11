function createConcertService(repository) {
  return {
    async getAllConcerts() {
      return repository.findAll();
    },
  };
}

module.exports = { createConcertService };
