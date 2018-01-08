(function($) // début du pluggin
{
    $.fn.game2048 = function() //function game2048 du pluggin
    {

        function generate_header(){
            var header = $("<div class='game_header'></div>");
            var headerPart1 = $("<div class='row row1'><h1>2048</h1><div id='all_scores_container'><div id='scores_container'><h3 id='score_title'>SCORE</h3><p id='score'>0</p></div><div id='best_scores_container'><h3 id='best_score_title'>RECORD</h3><p id='best_score'>0</p></div></div></div>");
            var headerPart2 = $("<div class='row row2'><p id='slogan'>Join the numbers and get to the 2048 tile !</p><button id='NG'class='newGame'>NEW GAME</button></div>");
            header.append(headerPart1).append(headerPart2);
            return header;
        }

        function generate_footer(){
            var footer = $("<div class='game_footer'></div>");
            var footerPart1 = $('<div class="row"><p id="rules"><strong>HOW TO PLAY</strong>: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p></div>');
            var footerPart2 = $('<div class="row"><p id="line"></p></div>');
            var footerPart3 = $('<div class="row "><p id="credits">Created by Gabriele Cirulli. Based on 1024 by Veewo Studio and conceptually similar to Threes by Asher Vollmer.</p></div>');
            footer.append(footerPart1).append(footerPart2).append(footerPart3);
            return footer;
        }

        function generate_map(){
            var table = $('<table></table>');
            for (var y = 0; y < 4; y++) {
                var ligne = $('<tr></tr>');
                for (var x = 0; x < 4; x++){
                    var cases = $('<td></td>').attr('x', x).attr('y', y).attr('nbr', 0).addClass("color_"+0);
                    ligne.append(cases);
                }
                table.append(ligne);
            }
            $("div#score").text(0);
            return table;
        }

        function generate_case(cases) {
            for (var i = 0; i < cases; i++) {
                var x = Math.floor((Math.random() * 4));
                var y = Math.floor((Math.random() * 4));
                var value =  2 * (Math.floor((Math.random() * 2) + 1));
                var elem = $('[x="' + x + '"][y="' + y + '"][nbr=0]');

                if (value === 4 && Math.random() > 0.5)
                    value = 2;
                if (!elem[0])
                    generate_case(1);
                else {
                    elem.attr('nbr', value);
                    elem.text(value);
                    elem.addClass("color_"+value);
                    
                }
            }
        }

        $('html').keydown(function(event) {
            if (!checkLoose() && (!checkWin())){
                switch (event['key']) {   
                    case 'ArrowLeft':
                        moveLeft();
                        checkWin();
                        break;
                    case 'ArrowUp':
                        moveUp();
                        checkWin();
                        break;
                    case 'ArrowRight':
                        moveRight();
                        checkWin();
                        break;
                    case 'ArrowDown':
                        moveDown();
                        checkWin();
                        break;
                }
            }
            else{
                if (checkWin()){
                    if($("div.win_loose_hover").length === 0){
                        $(".Games").prepend("<div class='win_loose_hover'><p>You Win !</p><img class='img' src='img/happy.svg'><button class='newGame'>NEW GAME</button></div>");
                        if (localStorage.getItem("bestScore") === null || parseInt(localStorage.getItem("bestScore")) < parseInt($("#score").text())){
                            localStorage.setItem("bestScore", parseInt($("#score").text()));
                            $("p#best_score").text(parseInt($("#score").text()));
                        }
                    }
                }
                else if (checkLoose()){
                    if($("div.win_loose_hover").length === 0){
                        $(".Games").prepend("<div class='win_loose_hover'><p>Game Over !</p><img class='img' src='img/sad.svg'><button class='newGame'>TRY AGAIN</button></div>");
                        if (localStorage.getItem("bestScore") === null || parseInt(localStorage.getItem("bestScore")) < parseInt($("#score").text())){
                            localStorage.setItem("bestScore", parseInt($("#score").text()));
                            $("p#best_score").text(parseInt($("#score").text()));
                        }
                    }
                }
            }
        });

        function moveLeft() {
            var moved = false;            
            for( var y = 0; y < 4; y++){
                for ( var x = 0; x < 4; x++){

                    var elemA = $('[x="'+ x +'"][y="'+ y +'"]');
                    var valueA = parseInt($('[x="'+ x +'"][y="'+ y +'"]').attr("nbr"));

                    if (valueA === 0){                        
                        for (a = x+1; a < 4; a++) {
                            var elemB = $('[x="' + a + '"][y="' + y + '"]');
                            var valueB = parseInt($('[x="' + a + '"][y="' + y + '"]').attr("nbr"));
                            if (valueB === 0)                
                                continue;
                            else if (valueB !== 0){
                                moveCase(elemA, elemB, valueB);
                                moved = true;
                                x--;
                                break;
                            }
                        }
                    }
                    else if (valueA !== 0){
                        for (a = x+1; a < 4; a++) {
                            var elemB = $('[x="' + a + '"][y="' + y + '"]');
                            var valueB = parseInt($('[x="' + a + '"][y="' + y + '"]').attr("nbr"));
                            if (valueB === 0)
                                continue;
                            else if (valueB !== valueA)
                                break;
                            else if (valueB === valueA){
                                addCases(elemA, elemB, valueA);
                                moved = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (moved === true)
                generate_case(1);
        }

        function moveUp() {
            var moved = false;            
            for( var x = 0; x < 4; x++){
                for ( var y = 0; y < 4; y++){

                    var elemA = $('[x="'+ x +'"][y="'+ y +'"]');
                    var valueA = parseInt($('[x="'+ x +'"][y="'+ y +'"]').attr("nbr"));

                    if (valueA === 0){                        
                        for (a = y+1; a < 4; a++) {
                            var elemB = $('[x="' + x + '"][y="' + a + '"]');
                            var valueB = parseInt($('[x="' + x + '"][y="' + a + '"]').attr("nbr"));
                            if (valueB === 0)                
                                continue;
                            else if (valueB !== 0){
                                moveCase(elemA, elemB, valueB);
                                moved = true;
                                y--;
                                break;
                            }
                        }
                    }
                    else if (valueA !== 0){
                        for (a = y+1; a < 4; a++) {
                            var elemB = $('[x="' + x + '"][y="' + a + '"]');
                            var valueB = parseInt($('[x="' + x + '"][y="' + a + '"]').attr("nbr"));
                            if (valueB === 0)
                                continue;
                            else if (valueB !== valueA)
                                break;
                            else if (valueB === valueA){
                                addCases(elemA, elemB, valueA);
                                moved = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (moved === true)
                generate_case(1);
        }

        function moveRight() {
            var moved = false;            
            for( var y = 0; y < 4; y++){
                for ( var x = 3; x >= 0; x--){

                    var elemA = $('[x="'+ x +'"][y="'+ y +'"]');
                    var valueA = parseInt($('[x="'+ x +'"][y="'+ y +'"]').attr("nbr"));

                    if (valueA === 0){                        
                        for (a = x-1; a >= 0; a--) {
                            var elemB = $('[x="' + a + '"][y="' + y + '"]');
                            var valueB = parseInt($('[x="' + a + '"][y="' + y + '"]').attr("nbr"));
                            if (valueB === 0)                
                                continue;
                            else if (valueB !== 0){
                                moveCase(elemA, elemB, valueB);
                                moved = true;
                                x++;
                                break;
                            }
                        }
                    }
                    else if (valueA !== 0){
                        for (a = x-1; a >= 0; a--) {
                            var elemB = $('[x="' + a + '"][y="' + y + '"]');
                            var valueB = parseInt($('[x="' + a + '"][y="' + y + '"]').attr("nbr"));
                            if (valueB === 0)
                                continue;
                            else if (valueB !== valueA)
                                break;
                            else if (valueB === valueA){
                                var z = valueA * 2;
                                addCases(elemA, elemB, valueA);
                                moved = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (moved === true)
                generate_case(1);
        }

        function moveDown() {
            var moved = false;            
            for( var x = 0; x < 4; x++){
                for ( var y = 3; y >= 0; y--){

                    var elemA = $('[x="'+ x +'"][y="'+ y +'"]');
                    var valueA = parseInt($('[x="'+ x +'"][y="'+ y +'"]').attr("nbr"));

                    if (valueA === 0){                        
                        for (a = y-1; a >=0; a--) {
                            var elemB = $('[x="' + x + '"][y="' + a + '"]');
                            var valueB = parseInt($('[x="' + x + '"][y="' + a + '"]').attr("nbr"));
                            if (valueB === 0)                
                                continue;
                            else if (valueB !== 0){
                                 moveCase(elemA, elemB, valueB);
                                moved = true;
                                y++;
                                break;
                            }
                        }
                    }
                    else if (valueA !== 0){
                        for (a = y-1; a >= 0; a--) {
                            var elemB = $('[x="' + x + '"][y="' + a + '"]');
                            var valueB = parseInt($('[x="' + x + '"][y="' + a + '"]').attr("nbr"));
                            if (valueB === 0)
                                continue;
                            else if (valueB !== valueA)
                                break;
                            else if (valueB === valueA){
                                addCases(elemA, elemB, valueA);
                                moved = true;
                                break;
                            }
                        }
                    }
                }
            }
            if (moved === true)
                generate_case(1);
        }

        function moveCase(elemA, elemB, valueB){
            elemA.attr("nbr", valueB);
            elemA.text(valueB);
            elemA.removeClass().addClass("color_"+valueB);
            elemB.attr("nbr", 0);
            elemB.text("");
            elemB.removeClass().addClass("color_"+0);
        }
        function addCases(elemA, elemB, valueA){
            var z = valueA * 2;
            elemA.attr("nbr", z);
            elemA.text(z);
            elemA.removeClass().addClass("color_"+z);
            elemB.attr("nbr", 0);
            elemB.text("");
            elemB.removeClass().addClass("color_"+0);
            $("#score").text(parseInt($("#score").text()) + z);
        }

        function checkWin(){
            var winner = false;
            var elemA = $('[nbr=2048]');
            if (elemA[0])  
                winner = true;
            return winner;
        }

        function checkLoose(){
            var elemA = $('[nbr=0]');
            if (elemA[0])
                return false;
            else {
                for( var y = 0; y < 4; y++){
                    for ( var x = 0; x < 4; x++){ 
                        var elemA = parseInt($('[x="'+ x +'"][y="'+ y +'"]').attr("nbr"));
                        var elemHaut = parseInt($('[x="'+ x +'"][y="'+ (y - 1) +'"]').attr("nbr"));
                        var elemDroit = parseInt($('[x="'+ (x + 1) +'"][y="'+ y +'"]').attr("nbr"));
                        var elemBas = parseInt($('[x="'+ x +'"][y="'+ (y + 1) +'"]').attr("nbr"));  
                        var elemGauche = parseInt($('[x="'+ (x - 1) +'"][y="'+ y +'"]').attr("nbr"));
                        if      (y > 0){
                            if (elemA === elemHaut)
                                return false;
                        }
                        if (y < 3){
                            if (elemA === elemBas)
                                return false;
                        }
                        if (x >0){
                            if (elemA === elemGauche)
                                return false;
                        }
                        if (x < 3){
                            if (elemA === elemDroit)
                                return false;
                        }
                    }
                }
                return true;
            }             
        }

        function reset_Game(){
            for( var y = 0; y < 4; y++){
                for ( var x = 0; x < 4; x++){
                    $('[x="'+ x +'"][y="'+ y +'"]').attr("nbr", 0);
                    $('[x="'+ x +'"][y="'+ y +'"]').text("");
                    $('[x="'+ x +'"][y="'+ y +'"]').removeClass().addClass("color_0");

                }
            }
        }
        
        $("div").on("click", ".newGame", function(){
            $("div.win_loose_hover").remove();
            reset_Game();
            generate_case(2);
            $("#score").text("0");
        });

        $(this).append(generate_header());
        $(this).append(generate_map()); 
        generate_case(2); 
        $(this).append(generate_footer());
        if (localStorage.getItem("bestScore") !== null)
            $("p#best_score").text(localStorage.getItem("bestScore"));

        return this;
    }

})(jQuery); 