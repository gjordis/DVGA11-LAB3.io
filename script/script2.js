'use strict'

$(document).ready(function () {
    let menuContainer = $('#meny'); // variabel för vart jag skall lägga innehållet med menyn

    // skapar en accordionContainer
    let accordionContainer = $('<div id="accordion"></div>');

    $.each(menu, function (category, items) {

        //variabel för att ge varje kategori ett unikt id(för att hantera expand/collapse). Replace anänds för att ta bort mellanslagen i kategori namnet.
        let categoryId = 'category' + category.replace(/\s+/g, '_');

        // 
        let categoryContainer = $('<div class="kategori"></div>');
        let categoryTitle = $('<h4 class="category-title collapsed p-3" data-bs-toggle="collapse" data-bs-target="#' + categoryId + '" role="button" aria-expanded="false" aria-controls="' + categoryId + '"></h4>').text(category);

        // skapar list-items som är dolda från början
        let itemList = $('<ul class="item-list mb-0 collapse list-unstyled" id="' + categoryId + '" data-bs-parent="#accordion"></ul>');

        /* letar upp alla a: för allergier och sätter till bold samt tar bort "a:" */
        $.each(items, function (index, item) {
            let itemContents = '';
            if (item.contents) {
                $.each(item.contents, function (i, content) {
                    if (content.startsWith('a:')) {
                        content = content.replace('a:', '');
                        itemContents += '<span class="allergi">' + content + '</span>';
                    } else {
                        itemContents += content;
                    }
                    if (i < item.contents.length - 1) {
                        itemContents += ', ';
                    }
                });
            }


            let listItem = $('<li class="p-3 d-flex justify-content-between flex-wrap"></li>').html
                ('<div id="pizza" class="d-flex flex-wrap"><strong>' + item.name + ':' + '</strong>'
                    + '<span id="price">' + item.price + ' :-' + '</span>' + '<span id="contents">' + itemContents + '</span></div>' + '<div id="addPizza"><i class="bi bi-plus-circle"></i></div>');


            itemList.append(listItem);

        });

        //lägger till titel i categoryContainer
        categoryContainer.append(categoryTitle);
        // lägger till itemlistan till categoryContainer
        categoryContainer.append(itemList);
        // lägger till category till accordion
        accordionContainer.append(categoryContainer);
    });

    menuContainer.append(accordionContainer); // lägg till accordion till meny

    // byter till varukorg
    $('#varukorg-btn').on('click', function () {
        $('#meny-varukorg').removeClass('d-none');
        $('#meny').addClass('d-none');
    });
    // byter till meny
    $('#meny-btn').on('click', function () {
        $('#meny').removeClass('d-none');
        $('#meny-varukorg').addClass('d-none');
    });

    /* Lägga till vara i varukorgen */
    $(document).on('click', '.bi-plus-circle', function (e) {
        let item = $(this).closest('li'); // hitta närmaste 'li' element
        let itemName = item.find('strong').text(); // hitta namnet på varan
        let itemPrice = item.find('#price').text(); // hitta priset på varan
        let itemContents = item.find('#contents').text(); // hitta innehållet i varan
        
        let categoryId = item.parent().attr('id'); // hitta id för kategorin
        let isPizza = categoryId.includes('Pizzor'); // kontrollera om det är en pizza
    
        let listItem;
        if (isPizza) {
            listItem = $('<li class="p-3 d-flex justify-content-between flex-wrap"></li>').html
                ('<div id="pizza" class="d-flex flex-wrap"><strong>' + itemName + '</strong>'
                    + '<span id="price">' + itemPrice + '</span>' + '<span id="contents">' + itemContents + '</span></div>' + '<div id="addComment"><i class="bi bi-chat-text"></i></div>' + '<div id="removePizza"><i class="bi bi-dash-circle"></i></div>');
        } else {
            listItem = $('<li class="p-3 d-flex justify-content-between flex-wrap"></li>').html
                ('<div id="pizza" class="d-flex flex-wrap"><strong>' + itemName + ':' + '</strong>'
                    + '<span id="price">' + itemPrice + '</span>' + '<span id="contents">' + itemContents + '</span></div>' + '<div id="removePizza"><i class="bi bi-dash-circle"></i></div>');
        }
        
        $('#meny-varukorg').append(listItem); // lägg till varan i varukorgen
    
    });
    


    /* ta bort vara från varukorgen */
    $(document).on('click', '.bi-dash-circle', function (e) {
        let listItem = $(this).closest('li'); // hitta närmaste 'li' element
        listItem.remove(); // ta bort 'li' elementet från DOM
    });

    /* Lägga till kommentar på vara i varukorg */
    $(document).on('click', '#addComment', function (e) {
        let listItem = $(this).closest('li'); // hitta närmaste 'li' element
        let commentBox = listItem.find('textarea'); // letar efter en textarea i listobjektet
        let saveButton = listItem.find('#saveButton'); // letar efter spara-knappen i listobjektet
        let existingComment = listItem.find('p'); // hitta befintlig kommentar
        let commentIcon = $(this).children(); // hitta kommentarikonen
    
        // kollar om textarea och saveButton redan finns
        if (commentBox.length > 0 && saveButton.length > 0) {
            // om de finns, ta bort dem
            commentBox.remove();
            saveButton.remove();
            commentIcon.removeClass('bi-chat-text-fill').addClass('bi-chat-text'); // ändrar ikonen till ofylld
        } else {
            // om de inte finns, skapa dem
            if (existingComment.length) { // om en kommentar redan finns
                commentBox = $('<textarea class="mt-3" placeholder="Lägg till kommentar">' + existingComment.text() + '</textarea>'); // skapa en inmatningsruta med befintlig kommentar
            } else {
                commentBox = $('<textarea class="mt-3" placeholder="Lägg till kommentar"></textarea>'); // skapa en inmatningsruta
            }
            saveButton = $('<button class="btn btn-sm border-0 rounded-0 mt-3" id="saveButton">Spara</button>');
            saveButton.on('click', function () { // lägg till en händelsehanterare för "spara"-knappen
                let comment = commentBox.val(); // hämta kommentaren från inmatningsrutan
                if (existingComment.length) { // om en kommentar redan finns
                    existingComment.text(comment); // uppdatera befintlig kommentar
                } else {
                    listItem.append('<p class="mt-3">' + comment + '</p>'); // lägg till kommentaren under listobjektet
                }
                commentBox.remove(); // ta bort inmatningsrutan
                saveButton.remove(); // ta bort "spara"-knappen
                commentIcon.removeClass('bi-chat-text-fill').addClass('bi-chat-text'); // ändrar ikonen till ofylld
            });
            listItem.append(commentBox); // lägg till inmatningsrutan under listobjektet
            listItem.append(saveButton); // lägg till "spara"-knappen under listobjektet
    
            if (commentIcon.hasClass('bi-chat-text')) {
                commentIcon.removeClass('bi-chat-text').addClass('bi-chat-text-fill');
            } 
        }
    });
    




    /*  här skall knapparna bli interaktiva  */

    // vid tryck ändra till fylld ikon
    $(document).on('touchstart', '.bi-plus-circle, .bi-dash-circle', function () {
        let currentIcon = $(this);
        if (currentIcon.hasClass('bi-plus-circle')) {
            currentIcon.removeClass('bi-plus-circle').addClass('bi-plus-circle-fill');
        } else if (currentIcon.hasClass('bi-dash-circle')) {
            currentIcon.removeClass('bi-dash-circle').addClass('bi-dash-circle-fill');
        }
    });

    // vid släpp ändra tillbaka ikonen
    $(document).on('touchend', '.bi-plus-circle-fill, .bi-dash-circle-fill', function () {
        let currentIcon = $(this);
        if (currentIcon.hasClass('bi-plus-circle-fill')) {
            currentIcon.removeClass('bi-plus-circle-fill').addClass('bi-plus-circle');
        } else if (currentIcon.hasClass('bi-dash-circle-fill')) {
            currentIcon.removeClass('bi-dash-circle-fill').addClass('bi-dash-circle');
        }
    });

});
