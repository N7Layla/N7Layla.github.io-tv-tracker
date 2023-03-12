$( document ).ready(function() {
});

$(function() { 
    var faves = document.getElementById("faves").querySelector('.flex');
    var current = document.getElementById("current").querySelector('.flex');
    var all = document.getElementById("all").querySelector('.flex');

    var mode = "img";
   
    var searchItem = {};
    var searchList = [];

	// Initialize Variables
	var closePopup = document.getElementById("popupclose");
	var overlay = document.getElementById("overlay");
	var popup = document.getElementById("popup");
	var button = document.getElementById("button");
	// Close Popup Event
	closePopup.onclick = function() {
	  overlay.style.display = 'none';
	  popup.style.display = 'none';
	};
	// Show Overlay and Popup
	button.onclick = function() {
	  overlay.style.display = 'block';
	  popup.style.display = 'block';
      document.getElementById("username").focus();
	}

    faves.innerHTML = localStorage.getItem("favesList") != null ? localStorage.getItem("favesList") : `<div class="poster"><div class="btn" id="del-btn"><img src="trash-2-outline.png" alt="trash"></div><span>Add some shows to get started!</span></div>`;
    current.innerHTML = localStorage.getItem("currentList") != null ? localStorage.getItem("currentList") : `<div class="poster"><div class="btn" id="del-btn"><img src="trash-2-outline.png" alt="trash"></div><span>Add some shows to get started!</span></div>`;
    all.innerHTML = localStorage.getItem("allList") != null ? localStorage.getItem("allList") : "";

    $('.poster').each(() => {
        this.addEventListener("dragstart", dragstart_handler);
        this.addEventListener("ondrop", drop_handler);
        this.addEventListener("ondragover", dragover_handler);
    })

    // $('.flex').each(() => {
    //     console.log("?hello?")
    //     this.removeEventListener("ondrop", drop_handler);
    //     this.removeEventListener("ondragover", dragover_handler);
    // })

    $('#login_form').on('submit', function(e) { 
        e.preventDefault();  
        var results = document.getElementById("results");
        results.replaceChildren();
        var data = $("#login_form :input").val();
        

        ajaxCall(data);
    });

    function ajaxCall(name) {
                    var url = 'https://api.tvmaze.com/search/shows?q=' + name;
            $.ajax({
                url: url,
                type: "GET",
  
                success: function (data) {
                    var x = JSON.stringify(data);
                    //console.log("??", x);
    
                    data.forEach(element => {

                        //console.log("hey", element["show"]["id"])
                        var resultListing = document.createElement("button");
                        resultListing.className = "result-item";
                        resultListing.innerHTML = element["show"]["name"] + " " + element["show"]["premiered"];
                        //var id = resultListing.createAttribute("id");
                        resultListing.setAttribute("id", element["show"]["id"]);
                        //id.value = element["show"]["id"]
                        //resultListing.id = element["show"]["id"];
                        //resultListing.setAttribute("title", element["show"]["name"] + " " + element["show"]["premiered"])

                        searchList.push({
                            "name": element["show"]["name"],
                            "id": element["show"]["id"]
                        })
                        resultListing.value = element["show"]["image"] != null ? element["show"]["image"]["medium"] : "";    

                        //resultListing.value = element;
                        $('#results').append(resultListing);
                        
                    });

                    //document.getElementById("results").firstChild.focus();
                   
                },
  
                // Error handling 
                error: function (error) {
                    console.log(`Error ${error}`);
                }                
            });
        }


        $("#results").on("click", ".result-item", function(){
            var poster = document.createElement("div");
            poster.className = "poster";   
            var id = $(this).attr('id');
            var posterUrl = $(this).attr('value');
            //poster.ariaLabel = $(this).innerText;   
            //poster.id = $(this).innerText.replace(/\s+/g, '-').toLowerCase();
            //var url = $(this).val()["show"]["image"] != null ? $(this).val()["show"]["image"]["medium"] : ""; 
            var showTitle = document.getElementById(id).innerText;
            //console.log("heeeey", document.getElementById(id).innerText)
            poster.style.backgroundImage = "url('" + posterUrl  + "')"; 
            poster.style.backgroundSize = "cover";
            poster.setAttribute('title', showTitle);
            poster.setAttribute('draggable', true);
            poster.id = "poster-" + id;
            //poster.draggable = true;
            
            
            var trash = document.createElement("img");
            trash.src = "trash-2-outline.png";
            trash.setAttribute("alt","trash");
            var heart = document.createElement("div");
            heart.className = "btn";
            heart.innerText = "";
            heart.id = "heart-btn";
            heart.classList.add('hide');
            var close = document.createElement("div");
            close.className = "btn";
            close.innerText = "";
            close.append(trash);
            close.id = "del-btn";

            var move = document.createElement("div");
            move.className = "btn";
            move.innerText = "";
            move.id = "move-btn";
            move.classList.add('hide');

            poster.append(close);
            poster.append(heart);
            poster.append(move);

            var favesText = document.querySelector("#text-faves");
            var li = document.createElement("li");
            li.innerText = showTitle;
            li.append(close.cloneNode(true));

            if (document.getElementById("poster-" + id)) {
                console.log("Already exists!", id);
            } else {
                console.log("all good");
                $("#all .flex").prepend(poster);               
                favesText.querySelector("ul").append(li);
            }
            
            poster.addEventListener("dragstart", dragstart_handler);          

});

$('.flex').on("click", "#heart-btn", (e) => {
    var parent = e.target.parentElement;
    faves.append(parent);
});

$('.flex').on("click", "#move-btn", (e) => {
    var parent = e.target.parentElement;
    current.append(parent);
});

$('.flex').on("click", "#del-btn", (e) => {
    var parent = e.target.parentElement;
    parent.remove();
});

$("#savebtn").on("click", () => {
    //localStorage.clear();
    localStorage.setItem("favesList", faves.innerHTML);
    localStorage.setItem("currentList", current.innerHTML);
    localStorage.setItem("allList", all.innerHTML);
});


});

function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    //ev.target.id = "currently-dragging";
    //console.log("??", ev.target);
    ev.dataTransfer.setData("text/html", ev.target.id); //("application/my-app", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  }
  function dragover_handler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }
  function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    const data = ev.dataTransfer.getData("text/html");
    //console.log("hi", data)
    //console.log("target", ev.target)
    var moving = document.getElementById(data);
    //ev.currentTarget.prepend(document.getElementById(data));
    //var before = moving.previousElementSibling;
    ev.currentTarget.insertBefore(moving, ev.target);
    //ev.target.appendChild(data);
  }

//   function addDraggable() {
//     var elements = document.getElementsByClassName("poster");
//     for (var i = 0; i < elements.length; i++) {
//         elements[i].draggable = true;
//         elements[i].id = "poster-" + i;
//         //console.log("poster-" + i);
//         //elements[i].addEventListener("dragstart", dragstart_handler);
//     }
//   }

// function addIds() {
//     var elements = document.getElementsByClassName("poster");
//     for (var i = 0; i < elements.length; i++) {
//         //elements[i].draggable = true;
//         //elements[i].id = "poster-" + i;
//         elements[i].addEventListener("dragstart", dragstart_handler);

//     }
// }

function toggleOptions() {
    var menu = document.getElementById("options-menu");
    //console.log("??", menu)
    menu.classList.toggle("hide");
}

function toggleButtons() {
    document.querySelectorAll('#heart-btn').forEach(b => b.classList.toggle("hide"));
    document.querySelectorAll('#move-btn').forEach(b => b.classList.toggle("hide"));
}

function textMode() {
    mode = "text";
    var favesCurrent = document.querySelectorAll("#faves .flex .poster");
    var favesText = document.querySelector("#text-faves");
    // favesCurrent.forEach(f => {
    //     var li = document.createElement("li");
    //     li.innerText = f.getAttribute("title");
    //     favesText.querySelector("ul").append(li);
    // })
    favesText.classList.toggle("hide");
}