function drawClock(canvasID, imgPath, color, isJJ) {
    var canvas = document.getElementById(canvasID);
    if (canvas.getContext) {
        var c2d = canvas.getContext('2d');
        c2d.clearRect(0, 0, 250, 250);
        var base_image = new Image();
        base_image.src = imgPath;
        c2d.drawImage(base_image, 105, 70, 40, 40);
        c2d.save();
        //Define gradients for 3D / shadow effect
        var grad1 = c2d.createLinearGradient(0, 0, 250, 250);
        grad1.addColorStop(0, color[0]);
        grad1.addColorStop(1, color[1]);
        var grad2 = c2d.createLinearGradient(0, 0, 250, 250);
        grad2.addColorStop(0, color[2]);
        grad2.addColorStop(1, color[3]);
        c2d.font = "Bold 20px Arial";
        c2d.textBaseline = "middle";
        c2d.textAlign = "center";
        c2d.lineWidth = 1;
        c2d.save();
        //Outer bezel
        c2d.strokeStyle = grad1;
        c2d.lineWidth = 10;
        c2d.beginPath();
        c2d.arc(125, 125, 115, 0, Math.PI * 2, true);
        c2d.shadowOffsetX = 4;
        c2d.shadowOffsetY = 4;
        c2d.shadowColor = "rgba(0,0,0,0.6)";
        c2d.shadowBlur = 4;
        c2d.stroke();
        //Inner bezel
        c2d.restore();
        c2d.strokeStyle = grad2;
        c2d.lineWidth = 10;
        c2d.beginPath();
        c2d.arc(125, 125, 105, 0, Math.PI * 2, true);
        c2d.stroke();
        c2d.strokeStyle = "#222";
        c2d.save();
        c2d.translate(125, 125);

        //Markings/Numerals
        for (i = 1; i <= 60; i++) {
            ang = Math.PI / 30 * i;
            sang = Math.sin(ang);
            cang = Math.cos(ang);
            //If modulus of divide by 5 is zero then draw an hour marker/numeral
            if (i % 5 == 0) {
                c2d.lineWidth = 4;
                sx = sang * 85;
                sy = cang * -85;
                ex = sang * 100;
                ey = cang * -100;
                nx = sang * 70;
                ny = cang * -70;
                if (isJJ) {
                    c2d.fillText(8, nx, ny);
                } else {
                    c2d.fillText(i / 5, nx, ny);
                }
                //Else this is a minute marker
            } else {
                c2d.lineWidth = 2;
                sx = sang * 95;
                sy = cang * -95;
                ex = sang * 100;
                ey = cang * -100;
            }
            c2d.beginPath();
            c2d.moveTo(sx, sy);
            c2d.lineTo(ex, ey);
            c2d.strokeStyle = "#787878";
            c2d.stroke();
        }
        //Fetch the current time
        var ampm = "AM";
        var now = new Date();
        var hrs = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();
        c2d.strokeStyle = "#000";
        //Draw AM/PM indicator
        if (hrs >= 12) ampm = "PM";
        c2d.lineWidth = 1;
        c2d.strokeRect(25, -10, 35, 20);
        c2d.fillText(ampm, 43, 0);
        c2d.lineWidth = 4.5;
        c2d.save();
        //Draw clock pointers but this time rotate the canvas rather than
        //calculate x/y start/end positions.
        //
        //Draw hour hand
        c2d.rotate(Math.PI / 6 * (hrs + (min / 60) + (sec / 3600)));
        c2d.beginPath();
        c2d.moveTo(0, 10);
        c2d.lineTo(0, -50);
        c2d.lineCap = 'round';
        c2d.stroke();
        c2d.restore();
        c2d.save();
        //Draw minute hand
        c2d.rotate(Math.PI / 30 * (min + (sec / 60)));
        c2d.beginPath();
        c2d.moveTo(0, 20);
        c2d.lineTo(0, -90);
        c2d.lineCap = 'round';
        c2d.stroke();
        c2d.restore();
        c2d.save();
        //Draw second hand
        c2d.rotate(Math.PI / 30 * sec);
        c2d.strokeStyle = "#E33";
        c2d.beginPath();
        c2d.moveTo(0, 20);
        c2d.lineTo(0, -90);
        c2d.lineCap = 'round';
        c2d.stroke();
        c2d.restore();

        //Additional restore to go back to state before translate
        //Alternative would be to simply reverse the original translate
        c2d.restore();
        setTimeout(function() { drawClock(canvasID, imgPath, color, isJJ); }, 1000);
    }
}