import handlebars from "handlebars";

export const rootRoute = (app) => {
  // Define a simple template to safely generate HTML with values from user's profile
  var template = handlebars.compile(`
<html><head><title>Twitch Auth Sample</title></head>
<table>
    <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
    <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
    <tr><th>Display Name</th><td>{{data.[0].display_name}}</td></tr>
    <tr><th>Bio</th><td>{{data.[0].description}}</td></tr>
    <tr><th>Image</th><td><img src={{data.[0].profile_image_url}}></img></td></tr>
</table></html>`);

  // If user has an authenticated session, display it, otherwise display link to authenticate
  app.get("/", (req, res) => {
    if (req.session && req.session.passport && req.session.passport.user) {
      res.send(template(req.session.passport.user));
    } else {
      res.send(
        '<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSRs4nXNnQv-1QvdHUXNlxQxrCNIEdiLbR6g&usqp=CAU"></a></html>'
      );
    }
  });
};
