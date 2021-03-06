(function(window, document, $, c) {
"use strict";

	var DEFAULT_CATEGORY = "general";
	var me = [];
	var friends = [];

	//	Get all types of betting categories
	var getCategories = function() {
		return c.get("categories");

	};

	//	Get logged in user's friends
	var getFriends = function() {
		return c.get("friends");
	};

	//	Get my information from Venmo or login process.
	var getSelfInfo = function() {
		return c.get("me");
	};

	//	Inject categories into the page
	var injectCategories = function(cats, selected) {
		var display = "";
		var sel = "";
		for (var i = 0; i < cats.length; i++) {
			display +=	"<li id='" + cats[i] +  "' style='display: inline-block;'>";
			display += (i === selected) ? "<b>" + cats[i] + "</b>" : cats[i];
			display += "</li>";
		}

		$("#categories").empty();
		$("#categories").append(display);
	};

	//	Display data for a specific category
	var showCategoryData = function(cat) {
		var data = "";
		if(cat === "general") {
			data =	"Bet: <input type='text' name='description' id='bet'>";
		}
		$('#form').empty();
		$("#form").append(data);
	};

	var injectFriends = function() {
		$("#aUser-dropdown").empty();
		for (var i = 0; i < friends.length; i++) {
			$("#aUser-dropdown").append("<option id=" + friends[i].id + " value='" + 
				friends[i].profile_picture_url + "'>" + friends[i].display_name + "</option>");
		}
	};

	//	Inject the category options, select a default, and setup on click events.
	var init = function(sorter) {
		sorter = sorter || DEFAULT_CATEGORY;
		injectFriends();
		$("#pImage").attr("src", me.picture); 
		$("#aImage").attr("src", $("#aUser-dropdown option:selected").val()); 
		getCategories().done(function(categories) {
			categories = ["general"];
			var chosen = 0;
			for (var i = 0; i < categories.length; i++) {
				if(categories[i] === sorter) {
					chosen = i;
				}
			}
			injectCategories(categories, chosen);
			showCategoryData(categories[chosen]);

			for (var i = 0; i < categories.length; i++) {
				var catObj = $("#"+categories[i]);
				catObj.category = categories[i];
				catObj.on('click', function() {
					showCategoryData(catObj.category);
				});
			}
		});

		// var nemesis = {name: "test"};
		$("#pUser").append(me.name);
		// $("#aUser").append(nemesis.name);

		$("#bet").on('click', function() {
			window.console.log("placing a bet");
			var data = {};
			data.poser = me.id;
			data.p_amount = $("#p_amount").val();
			data.poser_name = $("#aUser-dropdown option:selected").text();
			data.poser_pic = me.picture;
			data.acceptor = $("#aUser-dropdown option:selected").attr("id");
			data.a_amount = $("#a_amount").val();
			data.acceptor_name = me.name;
			data.acceptor_pic = $("#aUser-dropdown option:selected").val();
			data.arbiter = 1;
			data.arbiter_name = "Robby";
			data.description = $("#bet").val();

			data = JSON.stringify(data);

			window.console.dir(data);
			c.post(data, "bet").done(function() {
				c.route("main");
			});
		});

		$("#aUser-dropdown").change(function() {
			var pic = $(this).val();
			$("#aImage").attr("src", pic); 
		});
	};

	$(function() {
		getSelfInfo().done(function(data) {
			me = data;
			getFriends().done(function(friendList) {
				friends = (friendList.data).sort();
				window.console.dir(friends);
				init();	//	init the page with default category
			});
		});
	});


})(window, document, window.$, window.common);