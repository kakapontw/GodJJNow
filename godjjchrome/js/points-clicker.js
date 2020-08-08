function clickPointsButton() {
	try {
        // points_str => 123,123, we need to parse str to int for calculate clicked points
        var old_points_str = document.getElementsByClassName('community-points-summary')[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[0].textContent;
        var old_points = parseInt(old_points_str.replace(/,/g, ''));

        // click button!
        document.querySelector('.community-points-summary').querySelector('button.tw-button').click();

        // wait some time for value update
        setTimeout(function(old_points) {
            var new_points_str = document.getElementsByClassName('community-points-summary')[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[0].textContent;
            var new_points = parseInt(new_points_str.replace(/,/g, ''));
            var clicked_points = new_points - old_points;
            
            console.log('Get GodJJ points: '+ clicked_points + ' [' + old_points + ' -> ' + new_points + '], Time: ' + new Date());
        }, 3000, old_points);
    }
    catch(err) {}
}

// Initialized check
clickPointsButton();

// Register button arrive
document.arrive('.tw-button', clickPointsButton);
