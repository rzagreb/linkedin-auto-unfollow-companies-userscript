// ==UserScript==
// @name         LinkedIn Auto Unfollow All Companies
// @namespace    https://github.com/rzagreb/linkedin-auto-unfollow-companies-userscript
// @version      0.0.1
// @description  Adds a button to automatically unfollow companies on LinkedIn.
// @author       Roman Zagrebnev
// @match        https://www.linkedin.com/mynetwork/network-manager/company/*
// @icon         https://www.linkedin.com/favicon.ico
// @grant        none
// @updateURL    https://github.com/rzagreb/linkedin-auto-unfollow-companies-userscript/raw/main/linkedin-auto-unfollow-companies.user.js
// @downloadURL  https://github.com/rzagreb/linkedin-auto-unfollow-companies-userscript/raw/main/linkedin-auto-unfollow-companies.user.js
// ==/UserScript==

(function() {
    'use strict';

    function createFloatingButton() {
        let button = document.createElement("button");
        button.innerHTML = "Unfollow all";
        button.style.position = "fixed";
        button.style.left = "10px";
        button.style.top = "80px";
        button.style.zIndex = "9999";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#0073b1"; // LinkedIn blue
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.fontSize = "14px";
        button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

        button.onclick = startUnfollowing;

        document.body.appendChild(button);
        console.log("Floating button created.");
    }

    function startUnfollowing() {
        console.log("Start button clicked. Beginning the unfollowing process.");
        processAllButtons();
    }

    function processAllButtons() {
        console.log("Starting to process all buttons...");

        let interval = setInterval(function() {
            let followButtonXPath = "//button[contains(@aria-label, 'Click to stop following')]";
            let button = document.evaluate(followButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (button) {
                unfollowCompanies();
            } else {
                clearInterval(interval);
                console.log("All companies unfollowed or no more buttons available.");
            }
        }, 1000);
    }

    function unfollowCompanies() {
        console.log("Attempting to unfollow a company...");

        // Find the follow/unfollow button
        let followButtonXPath = "//button[contains(@aria-label, 'Click to stop following')]";
        let button = document.evaluate(followButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (button) {
            scrollToElement(button);

            // Click the button after a delay
            setTimeout(function() {
                if (clickButton(followButtonXPath)) {
                    // Wait for popup and click 'Unfollow'
                    setTimeout(function() {
                        let unfollowButtonXPath = "//button[contains(@class, 'artdeco-button')]/*[contains(.,'Unfollow')]";
                        if (clickButton(unfollowButtonXPath)) {
                            console.log("Successfully clicked Unfollow.");
                        } else {
                            console.log("Failed to click Unfollow.");
                        }
                    }, 500); // delay for the popup
                }
            }, 100); //delay for scrolling

        } else {
            console.log("No more buttons found on the page.");
        }
    }

    function scrollToElement(element) {
        console.log("Scrolling to element:", element);
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function clickButton(xpath) {
        let button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) {
            console.log("Button found, clicking:", button.innerText);
            button.click();
            return true;
        }
        console.log("Button not found for XPath:", xpath);
        return false;
    }

    createFloatingButton();
})();
