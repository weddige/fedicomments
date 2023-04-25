import DOMPurify from "dompurify";
export default class FediComments {
    constructor(host, user, id, container, render) {
        this.render = null;
        this.commentsLoaded = false;
        this.comments = [];
        this.host = host;
        this.user = user;
        this.id = id;
        this.element = document.getElementById(container);
        if (render != null) {
            this.render = render;
        }
    }
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    user_account(account) {
        var result = `@${account.acct}`;
        if (account.acct.indexOf('@') === -1) {
            var domain = new URL(account.url);
            result += `@${domain.hostname}`;
        }
        return result;
    }
    render_toots(toots, in_reply_to, depth) {
        var tootsToRender = toots.filter(toot => toot.in_reply_to_id === in_reply_to);
        tootsToRender.forEach(toot => this.render_toot(toots, toot, depth));
    }
    render_toot(toots, toot, depth) {
        toot.account.display_name = this.escapeHtml(toot.account.display_name);
        // We should do a schema validation as this is just a guess.
        toot.account.emojis.forEach(emoji => {
            toot.account.display_name = toot.account.display_name.replace(`:${emoji.shortcode}:`, `<img src="${this.escapeHtml(emoji.static_url)}" alt="Emoji ${emoji.shortcode}" height="20" width="20" />`);
        });
        toot.account.avatar_static = this.escapeHtml(toot.account.avatar_static);
        toot.auxiliary = {
            "depth": depth,
            "account": this.user_account(toot.account)
        };
        if (this.render != null && this.element != null) {
            let mastodonComment = this.render(toot);
            this.element.appendChild(DOMPurify.sanitize(mastodonComment, { 'RETURN_DOM_FRAGMENT': true }));
        }
        this.comments.push(toot);
        this.render_toots(toots, toot.id, depth + 1);
    }
    loadComments() {
        if (this.commentsLoaded)
            return;
        if (this.render != null && this.element != null) {
            this.element.innerHTML = "Loading comments from the Fediverse...";
        }
        fetch('https://' + this.host + '/api/v1/statuses/' + this.id + '/context')
            .then((response) => {
            return response.json();
        })
            .then((data) => {
            if (data['descendants'] && Array.isArray(data['descendants']) && data['descendants'].length > 0) {
                if (this.render != null && this.element != null) {
                    this.element.innerHTML = "";
                }
                this.render_toots(data['descendants'], this.id, 0);
            }
            else {
                if (this.render != null && this.element != null) {
                    this.element.innerHTML = "<p>Not comments found</p>";
                }
            }
            if (this.element != null) {
                this.element.dispatchEvent(new CustomEvent('comments-loaded'));
            }
            this.commentsLoaded = true;
        });
    }
}
