Template.tickets.helpers({
  activeTickets: function () {
    // Figure out what column this ticket viewer is in, defaults to 1.
    const column = this.column ? this.column : 1;

    return Tickets.find({
      status: {
        $in: ['OPEN', 'CLAIMED']
      }, // Narrow down selection by grouping based on table number.
      location: {
        $gt: column*100, $lt: (column+1)*100
      }
    }).fetch();
  }
});
