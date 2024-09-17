exports.generateTicketNumber = (element, type) => {
  if (type === 'dateEmitted') {
    const date = new Date()
    const dateEmitted = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    if (element && element.dateEmitted === dateEmitted) {
      return parseInt(element.ticketNumber) + 1
    } else {
      return dateEmitted.replace(/-/g, '') + '0001'
    }
  }
}
