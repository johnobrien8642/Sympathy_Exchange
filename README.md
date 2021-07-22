Hi, welcome to my clone of Tumblr, called Rumblr.

Exploring Rumblr is easy. Follow the link below. The form is pre-filled
with a guest account. Simply click Log in. You can also make your own account
by navigating to the Sign up page.

https://rumblr.app

Rumblr will automatically log you out after 2 hours. Simply log back in if you weren't
done exploring Rumblr.

I'm currently working on implementing a Dockerfile to make this app available
to download and run locally. For now you can check out the hosted version
and inspect the source code here in this repository.

[Check out this full list of features I've made for all the features I was able to implement (there are 90+!).](https://d1k9pgunak0305.cloudfront.net/ListOfFeaturesRumblr.pdf)

[Check out this blog post where I give more information 
about my story and a full critique of this app.](https://johnobriendeveloper.com/blog/60e2367e16fa3c12470e36d5)


The stack used to create this clone is MongoDB, Express, React, Node, GraphQL and Apollo.
My static file database is AWS s3 with Cloudfront as the CDN. My database is MongoDB Atlas.
App Academy teaches two tech stacks throughout their course. They begin with Ruby and Ruby
On Rails with Postgresql and they end with the MERN stack. While I do enjoy Ruby On Rails
and look forward to possibly returning to it in the future, I decided to use the
MERNGA stack here for a few different reasons:

-I wanted to gain as much as experience as I could using Javascript.

-After being introduced to React I found that I really enjoyed how easy it made
using Javascript to render all of my UI.

-I found that the GraphQL query paradigm made a lot of sense to me and offered me 
a degree of control over my queries that other fetching methods lack.

-There were a few times when I did end up using regular RESTful routes. Express
makes REST easy.

-I greatly enjoy the power of Apollo and wanted to get more experience using it. 

-I find I'm very interested in NoSQL and enjoy using the document based database
system. MongoDB and Mongoose is a very mature and powerful combination. I knew I
was going to be changing my database frequently and not having to write migrations
helped greatly speed up development time.

-The MERNGA stack I used is far less forgiving and streamlined than using Ruby On Rails.
I wanted to challenge myself to master a less forgiving stack to really solidify my 
the fundamentals of my newly acquired programming knowledge.

---------------------------------------------------------------------------------------

I attempted to clone as many features as I could possibly handle during the past three months.
I break down my reasons why I chose to clone so many features in [this blog post.](https://johnobriendeveloper.com/blog/60e2367e16fa3c12470e36d5)

The effect I was trying to achieve was basically creating a fully functioning and usable
social media website application that worked across browsers and mobile.

Highlighting just a few of the features I built, these two come to mind:

1) I built my own custom drag and drop for posts and forms using both React, Node and
   vanilla Javascript. To keep the look and feel of Tumblr I used a combination
   of image containers and text box containers. I leveraged the useEffect hook
   with custom object indexes to keep the image file upload array in sync with
   how the images were being displayed. Doing this ensured that the file uploads
   were always uploaded and returned in the order that they appeared within the post.
   
2) Tumblr has a style of post called a Chat post, and I built my own version of it.
   This was a great learning experience using Javascript ranges, selections and a
   little bit of regex. I used all three to make the Chat post function. When making
   a chat post everytime a colon is entered on a new line everything to the left of the colon
   is bolded. This experience actually led me to learning about rich text editors and eventually
   implementing one called CKEditor which I integrated throughout the app.
   
 ---------------------------------------------------------------------------------------
 
This has been a great experience. I've learned so much just over the course of the past three months.
Looking back at my codebase as I'm about to declare the first version of this app finished
I can already see countless areas for improvement. I also see countless lessons that I'm excited
to have learned and look forward to being able to build upon in the future.

I hope you enjoy Rumblr and I look forward to any and all feedback!

John










