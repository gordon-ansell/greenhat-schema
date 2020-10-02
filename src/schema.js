/**
 * @file        Schema structured data.
 * @module      Schema
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const path = require('path');
const str = require("greenhat-util/string");

const SchemaBase = require("./schemaBase")
const Thing = require("./classes/thing")
const CreativeWork = require("./classes/creativeWork")
const CreativeWorkSeries = require("./classes/creativeWorkSeries")
const MediaObject = require("./classes/mediaObject")
const ImageObject = require("./classes/imageObject");
const WebSite = require('./classes/webSite');
const WebPage = require('./classes/webPage');
const FAQPage = require('./classes/faqPage');
const WebPageElement = require('./classes/webPageElement');
const WPHeader = require('./classes/wpHeader');
const WPFooter = require('./classes/wpFooter');
const SiteNavigationElement = require('./classes/siteNavigationElement');
const Article = require('./classes/article');
const SocialMediaPosting = require('./classes/socialMediaPosting');
const BlogPosting = require('./classes/blogPosting');
const Rating = require('./classes/rating');
const AggregateRating = require('./classes/aggregateRating');
const ItemList = require('./classes/itemList');
const BreadcrumbList = require('./classes/breadcrumbList');
const HowTo = require('./classes/howTo');
const HowToStep = require('./classes/howToStep');
const Organization = require('./classes/organization');
const Place = require('./classes/place');
const LocalBusiness = require('./classes/localBusiness');
const Movie = require('./classes/movie');
const MusicPlaylist = require('./classes/musicPlaylist');
const MusicRecording = require('./classes/musicRecording');
const MusicAlbum = require('./classes/musicAlbum');
const Offer = require('./classes/offer');
const AggregateOffer = require('./classes/aggregateOffer');
const Product = require('./classes/product');
const Review = require('./classes/review');
const TVSeries = require('./classes/tvSeries');
const VideoObject = require('./classes/videoObject');
const Person = require('./classes/person');
const ListItem = require('./classes/listItem');
const SoftwareApplication = require('./classes/softwareApplication');
const MusicGroup = require('./classes/musicGroup');
const Event = require('./classes/event');
const Comment = require('./classes/comment');
const Question = require('./classes/question');
const Answer = require('./classes/answer');
const TypeBase = require('./types/typeBase');
const PriceSpecification = require('./classes/priceSpecification')
const UnitPriceSpecification = require('./classes/unitPriceSpecification')
const QuantitativeValue = require('./classes/quantitativeValue')

/**
 * Schema class.
 */
class Schema
{
    /**
     * Context.
     * @type    {string}
     */
    static context = "https://schema.org";

    /**
     * Create an ID.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            Prefixed ID. 
     */
    static makeId(raw)
    {
        return SchemaBase.makeId(raw);
    }

    /**
     * Create an ID reference.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            ID reference.
     */
    static ref(raw)
    {
        return SchemaBase.ref(raw);
    }

    // ===================================================================
    // Create the various class schema.
    // ===================================================================

    static thing(id = null) {return new Thing(id);}

        static creativeWork(id = null) {return new CreativeWork(id);}

            static creativeWorkSeries(id = null) {return new CreativeWorkSeries(id);}

                static tvSeries(id = null) {return new TVSeries(id);}

            static mediaObject(id = null) {return new MediaObject(id);}

                static imageObject(id = null) {return new ImageObject(id);}

                static videoObject(id = null) {return new VideoObject(id);}
            
            static webSite(id = null) {return new WebSite(id);}

            static webPage(id = null) {return new WebPage(id);}
            
                static faqPage(id = null) {return new FAQPage(id);}
            
            static webPageElement(id = null) {return new WebPageElement(id);}

                static wpHeader(id = null) {return new WPHeader(id);}

                static wpFooter(id = null) {return new WPFooter(id);}

                static siteNavigationElement(id = null) {return new SiteNavigationElement(id);}
            
            static article(id = null) {return new Article(id);}

                static socialMediaPosting(id = null) {return new SocialMediaPosting(id);}

                    static blogPosting(id = null) {return new BlogPosting(id);}

            static movie(id = null) {return new Movie(id);}

            static musicPlaylist(id = null) {return new MusicPlaylist(id);}

                static musicAlbum(id = null) {return new MusicAlbum(id);}

            static musicRecording(id = null) {return new MusicRecording(id);}

            static review(id = null) {return new Review(id);}

            static softwareApplication(id = null) {return new SoftwareApplication(id);}

            static comment(id = null) {return new Comment(id);}

                static question(id = null) {return new Question(id);}

                static answer(id = null) {return new Answer(id);}

        static rating(id = null) {return new Rating(id);}

            static aggregateRating(id = null) {return new AggregateRating(id);}

        static itemList(id = null) {return new ItemList(id);}

            static breadcrumbList(id = null) {return new BreadcrumbList(id);}

        static listItem(id = null) {return new ListItem(id);}

        static event(id = null) {return new Event(id);}

        static howTo(id = null) {return new HowTo(id);}

        static howToStep(id = null) {return new HowToStep(id);}

        static organization(id = null) {return new Organization(id);}

            static localBusiness(id = null) {return new LocalBusiness(id);}

            static musicGroup(id = null) {return new MusicGroup(id);}

        static place(id = null) {return new Place(id);}

        static person(id = null) {return new Person(id);}

        static offer(id = null) {return new Offer(id);}

            static aggregateOffer(id = null) {return new AggregateOffer(id);}

        static product(id = null) {return new Product(id);}

        static priceSpecification(id = null) {return new PriceSpecification(id);}

            static unitPriceSpecification(id = null) {return new UnitPriceSpecification(id);}

        static quantitativeValue(id = null) {return new QuantitativeValue(id);}
        
    // ===================================================================
    // Create the various type schema.
    // ===================================================================

    static eventStatusType(val) {return new TypeBase('EventStatusType', val);}
    static eventAttendanceMode(val) {return new TypeBase('EventAttendanceMode', val);}
    static itemAvailability(val) {return new TypeBase('ItemAvailability', val);}
}

module.exports = Schema;
