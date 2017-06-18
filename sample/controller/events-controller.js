class EventsController {
  getAction(req) {
    const id = req.params.id;

    return Promise.resolve()
      .then(() => {
        return {
          id,
          title: "My event",
          start: 1484222400000,
          end: 1484226000000,
          allDay: false
        };
      });
  }

  deleteAction() {
    return Promise.resolve();
  }

  postAction() {
    return Promise.resolve();
  }

  patchAction() {
    return Promise.resolve();
  }

  putAction() {
    return Promise.resolve();
  }
}

module.exports = EventsController;