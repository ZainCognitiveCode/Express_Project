function customLogger(req, res, next) {
    const currentDate = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date());

    console.log(`[${currentDate}] ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = customLogger;
