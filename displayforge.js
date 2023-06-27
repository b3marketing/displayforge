// Current Working Script DisplayForge
$(document).ready(function () {

    ////////// TEST



    const displayForge = () => {


        let imageURLBase = `https://pix.idxre.com/pix/FLSMLS/main/0/223010974_0.jpg`;
        const createURL = (imageNumber, listingId) => {
            let imageURL = `https://pix.idxre.com/pix/FLSMLS/main/${imageNumber}/${listingId}_${imageNumber}.jpg`;
            return imageURL;
        }

        // create new class Listing with getReactMethod and getListingData as methods of the class and widget, display, container, shadow, listings, reactMethod, and listingData as constructor properties.
        class DisplayForge {
            constructor(widget) {
                this.widget = widget;
                this.display = this.getDisplay();
                this.container = this.getContainer();
                this.shadow = this.getShadow();
                this.listings = this.getListings();
                this.reactMethod = this.getReactMethod();
                this.listingData = this.getListingData();
                this.template = this.getTemplate();
                this.templateAttributes = this.getTemplateAttributes();
                this.newListingItems = this.createListingItems();
            }
            getDisplay() {
                if (this.widget.nextElementSibling.classList.contains('df-display')) {
                    return this.widget.nextElementSibling;
                } else {
                    return null;
                }
            }
            getContainer() {
                return this.widget.querySelector('.ihf-container');
            }
            getShadow() {
                return this.container.shadowRoot;
            }
            getListings() {
                return this.shadow.querySelectorAll('.shadow-root > .widget-container > .ui-grid > .ui-grid-item:first-child > .ui-grid > .ui-grid');
            }
            getReactMethod() {
                // for the first item in the listingElements array, retreive methods that include "__reactProps" in the name.
                let reactMethod = Object.getOwnPropertyNames(this.listings[0]).filter(item => item.includes('__reactProps'))[0];
                console.log(reactMethod)
                return reactMethod;
            }
            getListingData() {
                let listingData = [];
                Array.from(this.listings).forEach((listing) => {
                    let listingObject = listing[this.reactMethod].children.props.listing;
                    listingData.push(listingObject);
                });
                return listingData;
            }
            getTemplate() {
                return this.display.querySelector('.df-template');
            }
            getTemplateAttributes() {
                let templateAttributes = [];
                // Search the templates descendant nodes that contain attributes that contain the name forge-item. Push each matching element and the forge-item attribute value into attributes as an object.
                if (this.template) {
                    Array.from(this.template.querySelectorAll('*')).forEach((element) => {
                        if (element.attributes.length > 0) {
                            Array.from(element.attributes).forEach((attribute) => {
                                if (attribute.name.includes('forge-item')) {
                                    templateAttributes.push({
                                        element: element,
                                        attributeVal: attribute.value
                                    });
                                }
                            });
                        }
                    });
                } else {
                    console.log('Template Not Found');
                }

                return templateAttributes;
            }
            createListingItems() {
                // For each listing, clone the template and replace the forge-item attributes with the listing data.
                let newListingItems = [];

                if (this.templateAttributes.length > 0) {
                    this.listings.forEach((listing, i) => {
                        let listingData = this.listingData[i]; // Get the listing data

                        console.log(listingData, i);


                        this.templateAttributes.forEach((attribute) => {
                            let element = attribute.element; // Get the element
                            let attributeVal = attribute.attributeVal; // Get the attribute value
                            switch (attributeVal) {
                                case 'price':
                                    element.innerText = listingData.listPrice.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    });
                                    break;
                                case 'imageURL':
                                    let imageURL = listingData.mainImageUrl;
                                    element.src = imageURL;
                                    element.setAttribute('srcset', `${imageURL} 1x`);
                                    break;
                                case 'address':
                                    // get the first item in the listingData.address array shortened to 18 characters and appended with an ellipsis if it's longer than 18 characters.
                                    let address = listingData.address[0].substring(0, 15);
                                    if (listingData.address[0].length > 15) {
                                        address += '...';
                                    }
                                    element.innerText = address;
                                    break;
                                case 'city':
                                    element.innerText = listingData.city;
                                    break;
                                case 'beds':
                                    element.innerText = listingData.bedrooms;
                                    break;
                                case 'baths':
                                    element.innerText = listingData.fullBathrooms;
                                    break;
                                case 'squarefeet':
                                    element.innerText = listingData.squareFeet;
                                    break;
                                case 'listingURL':
                                    element.setAttribute('href', listingData.listingPageUrl);
                                    break;
                                case 'attribution':
                                    element.innerText = listingData.sellersRepFormatted;
                                    break;
                                default:
                                    element.innerText = '';
                            }
                        });
                        let newListingItem = this.template.cloneNode(true);
                        newListingItem.classList.remove('df-template');
                        newListingItems.push(newListingItem);
                    });
                } else {
                    console.log('No Template Attributes Found');
                }
                console.log(newListingItems);
                return newListingItems;
            }
            createGallery() {

            }
            writeOverListingItems() {
                this.newListingItems.forEach((el) => {
                    this.display.appendChild(el);
                });

                this.display.querySelector('.df-template').remove();
            }
        }

        const getDFInstances = () => {
            // Get all listing containers 
            const dfElements = document.querySelectorAll('.df-widget');

            // If dfWidgets exist, get the display element and push it into dfDisplays.
            if (dfElements.length > 0) {
                return Array.from(dfElements);
            } else {
                console.log('No Display Forge Widgets Found');
            };
        };

        const createDisplayForges = () => {
            let dfInstances = getDFInstances();
            console.log(dfInstances);
            let forges = [];
            dfInstances.forEach((dfInstance) => {
                forges.push(new DisplayForge(dfInstance));
            });

            return forges;
        };

        // Get Complete Forges
        let forges = createDisplayForges();
    };

    // Run DisplayForge
    displayForge();

});

    // TODO
/*
// Create the div element with the id "listingSlider". Class names are overwritten in shadowDOM.
const listingSlider = document.createElement('div');
listingSlider.classList.add('listingSlider');
listingSlider.id = 'listingSlider';

// Insert elements into into gallery
for (let i = 0; i < listingElements.length; i++) {
    $(listingSlider).append(listingElements[i]);
}


// Create function to write HTML string for each listing. Accepts a listing object as a parameter.
const createGridItems = (listing) => {
    // get listing.price and convert it to a USD formatted string
    let price = listing.listPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    let listingHTML = `
            <div class="listing_wrapper">
                <a href="${listing.listingPageUrl}" class="listing_link">
                    <div class="listing_image_wrapper">
                        <img class="listing_image" src="${listing.mainImageUrl}" alt="Listing Image"">
                    </div>
                    <div class="listing_content_wrapper">
                        <div class="listing_content_header">
                            <div class="listing_city">${listing.city}</div>
                            <div class="listing_price">${price}</div>
                        </div>
                        <div class="listing_beds">${listing.beds}</div>
                        <div class="listing_baths">${listing.baths}</div>
                        <div class="listing_squarefeet">${listing.squareFeet}</div>
                    </div>
                </a>
            </div>
        `;
    return listingHTML;
};
*/

    // ToDo - Create mutation observer to watch for new listings and call replaceListings() when new listings are added.



