module.exports = {
    handleErrorRes: (res, e) => {
        const errorName = e.title ? e.title : (e.name ? e.name : "Error");
        if (errorName === "TypeError" || e.message === "Validation error") {
            if(e.original){
                e = e.original;
            }
            res.status(400).json({
                code: "400",
                status: e.code || "BAD_REQUEST",
                error: {
                    title: e.title || e.name || typeof e,
                    message: e.message,
                },
            });
        } else {
            res.status(500).json({
                code: "500",
                status: "INTERNAL_SERVER_ERROR",
                error: {
                    title: e.title,
                    message: e.message,
                },
            });
        }
    }
}