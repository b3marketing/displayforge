// Version: 1.0
// Current Working Script DisplayForge
$(document).ready(function () {

    const displayForge = () => {
        /* This doesn't work because urls are different.
                let imageURLBase = `https://pix.idxre.com/pix/FLSMLS/main/0/223010974_0.jpg`;
                const createURL = (imageNumber, listingId) => {
                    let imageURL = `https://pix.idxre.com/pix/FLSMLS/main/${imageNumber}/${listingId}_${imageNumber}.jpg`;
                    return imageURL;
                }
                */
    
        // create new class called Listing that accepts a listing object as a parameter.
        class Listing {
          constructor(listingData, listingReference, template) {
            this.listing = listingData;
            this.listingReference = listingReference;
            this.sourceTemplate = template;
            this.saveButton = this.getSaveButton();
            this.template = this.getTemplate();
            this.templateAttributes = this.getTemplateAttributes();
            this.newListing = this.createListing();
          }
    
          getTemplate() {
            let sourceTemplate = this.sourceTemplate;
            if (!sourceTemplate) {
              console.log("No Template Found");
              return null;
            }
    
            let newTemplate = sourceTemplate.cloneNode(true);
    
            if (this.saveButton) {
            }
    
            newTemplate.classList.remove("df-template");
            return newTemplate;
          }
    
          getSaveButton() {
            // If save button contains an SVG, it won't copy over for some reason. This function clones the SVG and returns it.
            // Find an element inside sourceTemplate with forge-item attribute called "saveListing"
            let saveButtonSVG = this.sourceTemplate.querySelector(
              '[forge-item="saveListing"]'
            ).firstChild;
            let newSaveButton = saveButtonSVG.cloneNode(true);
            return newSaveButton;
          }
    
          getTemplateAttributes() {
            let templateAttributes = [];
            // Search the templates descendant nodes that contain attributes that contain the name forge-item. Push each matching element and the forge-item attribute value into attributes as an object.
            if (this.template) {
              Array.from(this.template.querySelectorAll("*")).forEach((element) => {
                if (element.attributes.length > 0) {
                  Array.from(element.attributes).forEach((attribute) => {
                    if (attribute.name.includes("forge-item")) {
                      templateAttributes.push({
                        element: element,
                        attributeVal: attribute.value,
                      });
                    }
                  });
                }
              });
            } else {
              console.log("Template Not Found");
            }
            return templateAttributes;
          }
    
          createListing() {
            // Loops through the templateAttributes array and replaces the forge-item attribute values with the listing data.
            this.templateAttributes.forEach((attribute) => {
              let element = attribute.element; // Get the element
              let attributeVal = attribute.attributeVal; // Get the attribute value
              switch (attributeVal) {
                case "price":
                  element.innerText = this.listing.listPrice.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }
                  );
                  break;
                case "imageURL":
                  let imageURL = this.listing.mainImageUrl;
                  element.src = imageURL;
                  element.setAttribute("srcset", `${imageURL} 1x`);
                  break;
                case "address":
                  // get the first item in the listingData.address array shortened to 18 characters and appended with an ellipsis if it's longer than 18 characters.
                  let address = this.listing.address[0].substring(0, 18);
                  if (this.listing.address[0].length > 18) {
                    address += "...";
                  }
                  element.innerText = address;
                  break;
                case "city":
                  element.innerText = this.listing.city;
                  break;
                case "beds":
                  element.innerText = this.listing.bedrooms;
                  break;
                case "baths":
                  element.innerText = this.listing.fullBathrooms;
                  break;
                case "squarefeet":
                  element.innerText = this.listing.squareFeet;
                  break;
                case "listingURL":
                  element.setAttribute("href", this.listing.listingPageUrl);
                  break;
                case "attribution":
                  element.innerText = this.listing.sellersRepFormatted;
                  break;
                case "saveListing":
                  element.addEventListener("click", (e) => {
                    e.preventDefault();
                    // find all buttons within listingReference and filter for one that contain an svg element with the aria-label "save";
                    let saveButton = Array.from(
                      this.listingReference.querySelectorAll("button")
                    ).filter((button) => {
                      if (button.querySelector('svg[aria-label="save"]')) {
                        return button;
                      }
                    });
    
                    saveButton[0].click();
                    console.log("Save Listing Clicked");
                  });
                default:
                  element.innerText = "";
              }
            });
            return this.template;
          }
          getListing() {
            if (this.saveButton) {
              this.newListing
                .querySelector('[forge-item="saveListing"]')
                .appendChild(this.saveButton);
            }
            return this.newListing;
          }
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
            this.newListingItems = this.createListingItems();
          }
          getDisplay() {
            if (this.widget.nextElementSibling.classList.contains("df-display")) {
              return this.widget.nextElementSibling;
            } else {
              return null;
            }
          }
          getContainer() {
            return this.widget.querySelector(".ihf-container");
          }
          getShadow() {
            return this.container.shadowRoot;
          }
          getListings() {
            let listings = this.shadow.querySelectorAll(
              ".shadow-root > .widget-container > .ui-grid > .ui-grid-item:first-child > .ui-grid > .ui-grid"
            );
            // set display none for each listing
            listings.forEach((listing) => {
              listing.style.display = "none";
            });
            return listings;
          }
          getReactMethod() {
            // for the first item in the listingElements array, retreive methods that include "__reactProps" in the name.
            let reactMethod = Object.getOwnPropertyNames(this.listings[0]).filter(
              (item) => item.includes("__reactProps")
            )[0];
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
            let template = this.display.querySelector(".df-template");
            return template;
          }
    
          createListingItems() {
            // For each listing, clone the template and replace the forge-item attributes with the listing data.
            let newListingItems = [];
            this.listings.forEach((listing, i) => {
              let newListingItem = new Listing(
                this.listingData[i],
                this.listings[i],
                this.template
              );
              newListingItems.push(newListingItem.getListing());
            });
            return newListingItems;
          }
          createGallery() {}
          writeOverListingItems() {
            this.newListingItems.forEach((el) => {
              this.display.appendChild(el);
            });
    
            this.display.querySelector(".df-template").style.display = "none";
            console.log(this.container)
            
          }

          // Create mutation observer to watch this.shadow for changes. If changes are detected, run this.writeOverListingItems();
          watchForChanges() {
            const observer = new MutationObserver(() => {
              console.log("Changes Detected");

              this.createListingItems();
              this.writeOverListingItems();
            });
            observer.observe(this.shadow, {
              subtree: true,
              childList: true,
            });
          }
        }
    
        const getDFInstances = () => {
          // Get all listing containers
          const dfElements = document.querySelectorAll(".df-widget");
    
          // If dfWidgets exist, get the display element and push it into dfDisplays.
          if (dfElements.length > 0) {
            return Array.from(dfElements);
          } else {
            console.log("No Display Forge Widgets Found");
          }
        };
    
        const createDisplayForges = () => {
          let dfInstances = getDFInstances();
          let forges = [];
          dfInstances.forEach((dfInstance) => {
            
              forges.push(new DisplayForge(dfInstance));
              
          });
    
          return forges;
        };
        
        // Get Complete Forges
        let forges = createDisplayForges();
        forges[0].writeOverListingItems();
      };

    
      function waitForElementToExist() {
        return new Promise(resolve => {
          if (Array.from(document.querySelector(".df-widget").querySelector(".ihf-container").shadowRoot.querySelectorAll(".widget-container > .ui-grid > .ui-grid-item:first-child > .ui-grid > .ui-grid")).length > 3) {
            return resolve();
          }
      
          const observer = new MutationObserver(() => {
            if (Array.from(document.querySelector(".df-widget").querySelector(".ihf-container").shadowRoot.querySelectorAll(".widget-container > .ui-grid > .ui-grid-item:first-child > .ui-grid > .ui-grid")).length > 3) {
              resolve();
              observer.disconnect();
            }
          });
      
          observer.observe(document.body, {
            subtree: true,
            childList: true,
          });
        });
      }
      
      // 👇️ using the function
      waitForElementToExist().then( () => {
        console.log('The element exists');
        displayForge();
      });

      // Run DisplayForge
      
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



