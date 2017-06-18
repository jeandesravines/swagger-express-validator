class ContactController {
  getAction(req) {
    const id = req.params.id;

    return Promise.resolve()
      .then(() => {
        return {
          id,
          firstName: "Jean",
          lastName: "Desravines"
        };
      });
  }

  getAllAction(req) {
    const contacts = new Array(10)
      .fill(0)
      .map((value, i) => {
        return {
          id: i + 1,
          firstName: `Jean-${i}`,
          lastName: `Desravines-${i}`,
        };
      });

    const offset = req.query.offset || 0;
    const limit = req.query.limit || contacts.length;

    return Promise.resolve()
      .then(() => {
        return contacts.slice(offset, limit);
      });
  }
}

module.exports = ContactController;