donottrackme
============

An experimental Chrome extension that attempts to minimise the data websites collect from what should be anonymous browsing

## Installation

As this is an experimental extension I don't plan on making it available in the Chrome Store or even packaging it up as a .crx. So to install it do the following:

1. Clone this repo, or download the zip version of the repo and unzip it
2. Settings > Tools > Extensions
3. Check "Developer mode"
4. Press "Load unpacked extension..." and select the directory where the extension code is cloned/unzipped

## What is the status of anonymous browsing?

The limits on what data might/could/should be collected from someone's browsing are still being debated world wide.

The current technology allows large amounts of data to be collected and analysed in real time, including tracking a user across multiple websites. A larger question is: should we allow this data to be collected in the first place? Tracking a persons communications requires a warrant in many countries, so why is it ok for private companies to track browsing in this way?

Current efforts to limit the collection of data include:

* [Do Not Track](http://donottrack.us/) is a technology and policy proposal that enables users to opt out of tracking by websites they do not visit, including analytics services, advertising networks, and social platforms. Not widely adopted by third-parties.
* [The Right To Be Forgotten](https://en.wikipedia.org/wiki/Right_to_be_forgotten) is a right to ask service providers to delete the personal information which was collected by data brokers under a users’ consent in order to strengthen the user information protection. It also includes the notion of not to be searched.
* [EU Cookie Legislation](http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm) requires websites to get users informed consent before placing a cookie on their machine. But there are exemptions for particular tyes of cookies. And it's EU only.
* Chrome extensions such as [AdBlock](https://chrome.google.com/webstore/detail/adblock/gighmmpiobklfepjocnamgkkbiglidom) blocks many advertisements on a web page, but does not block analytics; and [Ghostery](https://chrome.google.com/webstore/detail/ghostery/mlomiejdfkolichcflejclcbmpeaniij) which blocks trackers for many ad networks, behavioral data providers, web publishers, but [Ghostery sells the aggregate data it collects](https://www.ghostery.com/en/faq#q4-general).

So in general a user has to have a reasonably sophisticated browser setup (e.g. use a browser that supports "Do Not Track" and have that feature enabled + an ad blocker extension + a tracker extension) if they want to limit the tracking of their browsing. Shouldn't anonymity be the default behaviour and shouldn't it be easy?

## What does this extension do?

As noted above this is an *experimental* Chrome extension that attempts to block some of the tracking techniques currently employed by large media websites, beyond what AdBlock + Ghostery does.

The challenge is to keep up with the websites as they continuously change the mechanisms they use to track users.

So exactly how does this extension work?

## Default behaviour

Unless a website requires special handling this extension does the following:

* Does not send any cookies in HTTP requests. This technique will not work if a user needs to login to a website (e.g. a paid subscriber).
* Hides the [User Agent](https://en.wikipedia.org/wiki/User_agent). Instead of sending something that identifies at least the users browser and operating system this extension sends a User Agent pretending to be a common web crawler - the [Googlebot](https://en.wikipedia.org/wiki/Googlebot)!
* Sets the [Referer](https://en.wikipedia.org/wiki/HTTP_referer) so that it looks like the referer link was generated from a Google search result

## Special cases

The above default behaviour needs to be modified for some websites as follows:

### www.newyorker.com

Some links on newyorker.com add tracking infomation. e.g. a link in the "Most Popular" section will have a "src" query added to the end. e.g. "http://www.newyorker.com/magazine/2013/04/08/every-good-boy-does-fine?src=mp". This extension strips the additional tracking information.

### www.nytimes.com

The NYTimes is particularly tricky. The website will not work at all with cookies disabled; you will be redirected straight to a login page.

So this extension take a slightly convoluted approach: enable cookies but delete the cookies associated with the previous request.

The NYTimes also adds a lot of tracking information to each link that you click. e.g. the link "http://www.nytimes.com/2014/08/10/world/middleeast/iraq.html" when clicked will generate a GET request to "http://www.nytimes.com/2014/08/10/world/middleeast/iraq.html?hp&action=click&pgtype=Homepage&version=LedeSum&module=first-column-region&region=top-news&WT.nav=top-news". This extension strips the additional tracking information.

### www.wsj.com

WSJ does not like the User Agent being set to that of the Googlebot. For now this extension sends through the browsers real User Agent on wsj.com, though I'm thinking about sending through a randomly generate one instead.

## Supported websites

This extansion has been tested against the following websites:

* hbr.org
* www.news.com.au
* www.newyorker.com
* www.nytimes.com.au
* www.smh.com.au
* www.wired.com
* www.wsj.com

## If I use "Do Not Track" + a bunch of browser extensions/plugins will my browsing be anonymous?

No. Web servers generate logs of each request uri and the IP address that the request came from. With a bit of effort the browsing history of a user can be extracted and stitched together from these logs.

The best that can currently be done is to obscure your browsing and disrupt the data sent to analytics companies that have the ability to aggregate your browsing history across multiple websites.

"Do Not Track" + a bunch of browser extensions/plugins + routing requests through a number of proxy servers may get you close to anonymity.

## What do you suggest a website can do to improve its user experience if it doesn't track users?

That's a good question! My thoughts are constantly evolving on this issue. At the present I can suggest the following:

* Offer a reward if a users allows one (and only one!) of their sessions to be tracked. This is a standard marketing practice in the offline world.
* When the user first visits the website send them to a page that allows them to choose what the website tracks. This advice would be valid for a session.
* If a user logs in (e.g. a paid subscriber) then they are fair game to tracking as the conditions of tracking would have been spelled out in a Terms Of Service agreement.

## License

[MIT license](LICENSE)

## TODO

* Allow the user to enable/disable tracking prevention per website

## References

* [What are extensions?](https://developer.chrome.com/extensions)
* [chrome-cookies-eraser](https://github.com/ksol/chrome-cookies-eraser)
