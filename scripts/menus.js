/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

// this script is from: https://www.w3schools.com/howto/howto_js_dropdown.asp (taken December 4, 2024)

/* ORIGINAL SCRIPT:
function oldFunction() {
  document.getElementById("sub-topic-list").classList.toggle("show-menu");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('#sub-topic-menu-dropper')) {
    var dropdowns = document.getElementsByClassName("sub-topic-list");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show-menu')) {
        openDropdown.classList.remove('show-menu');
      }
    }
  }
}
*/

/* resources used:
    - https://www.w3schools.com/howto/howto_js_dropdown.asp                     // this is the source of the original JS script
    - https://www.shecodes.io/athena/37774-what-does-const-mean-in-javascript
    - https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
*/
// MODIFIED SCRIPT:
function dropDownMenu() {
  var menu = document.getElementById('sub-topic-list');           // the <div> we want to display on button press
  menu.classList.toggle("show-menu");                             // toggling the {display : block} class in the CSS file

  // the giant for loop in the original script was more or less unecessary, given that drowDownItems.length returned 1, meaning that the loop iterates over 1 item.
  // thus, the same effect can be accomplished with a single conditional.
  window.onclick = function(event) {                                    // upon clicking anywhere on the window
    if (!event.target.matches('.sub-topic-menu-dropper')) {             // if its not the menu button...
      var dropDownItem = document.getElementById('sub-topic-list');     // grab the list we dropped down
      if (dropDownItem.classList.contains('show-menu')) {               // if the 'show-menu' class has been added ("if the menu has been dropped down")
        dropDownItem.classList.remove('show-menu');                     // remove that class to take the menu back to {display : hidden}
      }
    }
  }
}
