const Member = require("../controllers/member");

module.exports = (app) => {
    app.route("/api/v1/members").get(Member.get_all);

    app.route("/api/v1/members/:memberCode").get(Member.get_by_id);

    app.route("/api/v1/members").post(Member.create);

    app.route("/api/v1/members").put(Member.update);

    app.route("/api/v1/members/:memberCode").delete(Member.delete);

}