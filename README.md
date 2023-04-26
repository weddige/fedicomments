# FediComments

FediComments is a module for easy integration of Mastodon comments into a website. It is based on previous work by [Carl Schwan](https://carlschwan.eu/2020/12/29/adding-comments-to-your-static-blog-with-mastodon/) and [Daniel Pecos Martínez](https://danielpecos.com/2022/12/25/mastodon-as-comment-system-for-your-static-blog/).

## Installation

The module can be installed via `npm`:

```bash
npm install fedicomments
```

## Usage

To get started with FediComments, simply add the following code to your site and replace `<your mastodon host>`, `<your mastodon user>` and `<the id of the toot>` with the appropriate values.

```html
<div id="mastodon-comments-list">
  <button id="mastodon-comments-load">Load comments</button>
</div>
<script type="module" type="text/javascript">
  import FediComments from "fedicomments";

  var fedicomments = new FediComments(
    "<your mastodon host>",
    "<your mastodon user>",
    "<the id of the toot>",
    "mastodon-comments-list",
    (toot) => `
<div style="margin-left: calc(2em * ${toot.auxiliary.depth})">
    <div>
        <img src="${toot.account.avatar_static}" height=60 width=60 alt="">
        <a href="${toot.account.url}" rel="nofollow">
            ${toot.account.display_name}</a>
        (<a href="${toot.account.url}" rel="nofollow">
            ${toot.auxiliary.account}</a>)<br>
        <a class="date" href="${toot.url}" rel="nofollow">
            ${toot.created_at.substr(0, 10)}
            ${toot.created_at.substr(11, 8)}</a>
    </div>
    <div>${toot.content}</div>
</div>`
  );
  document.getElementById("mastodon-comments-load").onclick = function () {
    fedicomments.loadComments();
  };
</script>
```

This will not look pretty, but it will display a button that will load the comments. To adapt the layout of the comments to your website, you need to change the templating string.

The variable `toot` is a Mastodon status. In addition to all the [default values](https://docs.joinmastodon.org/methods/statuses/#200-ok-1) FediComments adds some auxiliary values, that you can use as well:

- `toot.auxiliary.depth` is the depth of nested comments
- `toot.auxiliary.account` is the full account name (e.g. `@user@server.tld`)

An alternative solution is to use Alpine.js. The idea is similar, but the template can be defined as HTML, which allows autocomplete if you are using an IDE.

```html
<div id="mastodon-comments-list" x-data="{ comments: [], commentsLoaded: false }"
    x-on:comments-loaded="comments.push(...fedicomments.comments); commentsLoaded = true">
    <button id="mastodon-comments-load" x-show="!commentsLoaded" x-on:click="fedicomments.loadComments()">
        Load comments
    </button>
    <template x-for="comment in comments">
        <div x-bind:style="`margin-left: calc(2em * ${comment.auxiliary.depth})!important`">
            <div>
                <img x-bind:src="comment.account.avatar_static" height="60" width="60" alt="" />
                <a x-bind:href="comment.account.url" x-html="comment.account.display_name" rel="nofollow"></a>
                <a x-bind:href="comment.account.url" x-text="comment.auxiliary.account" rel="nofollow"></a><br />
                <a x-bind:href="comment.url"
                    x-text="`${comment.created_at.substr(0, 10)} ${comment.created_at.substr(11, 8)}`"
                    rel="nofollow"></a>
            </div>
            <div class="content" x-html="comment.content"></div>
        </div>
    </template>
</div>
<script type="module" type="text/javascript">
    import FediComments from "fedicomments";
    import Alpine from "alpinejs";

    window.fedicomments = new FediComments(
        "<your mastodon host>",
        "<your mastodon user>",
        "<the id of the toot>",
        "mastodon-comments-list"
    );

    Alpine.start();
</script>

```
