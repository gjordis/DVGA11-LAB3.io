/* GruppMedlemmar: Jonas Schymberg & Kristoffer Tapper */

'use strict'

$(document).ready(function () {
    // variabel för vart jag skall lägga innehållet med menyn
    let menuContainer = $('#meny');

    // skapar en accordionContainer
    let accordionContainer = $('<div id="accordion"></div>');

    // går igenom menyn
    $.each(menu, function (category, items) {

        //variabel för att ge varje kategori ett unikt id(för att hantera expand/collapse). Replace anänds för att ta bort mellanslagen i kategori namnet.
        let categoryId = 'category' + category.replace(/\s+/g, '_');

        // skapar kategorier
        let categoryContainer = $('<div class="kategori"></div>');
        // skapar titeln
        let categoryTitle = $('<h4 class="category-title collapsed p-3" data-bs-toggle="collapse" data-bs-target="#' 
        + categoryId + '" role="button" aria-expanded="false" aria-controls="' + categoryId + '"></h4>').text(category);

        // skapar list-items som är dolda från början
        let itemList = $('<ul class="item-list mb-0 collapse list-unstyled" id="' + categoryId + '" data-bs-parent="#accordion"></ul>');

        /* letar upp alla a: för allergier och sätter till bold samt tar bort "a:" */
        $.each(items, function (index, item) {
            let itemContents = '';
            if (item.contents) {
                // går igenom varje item och letar efter "a:"
                $.each(item.contents, function (i, content) {
                    if (content.startsWith('a:')) {
                        // ersätter "a:" med en stjärna
                        content = content.replace('a:', '*');
                        //console.log(content);
                        //console.log(itemContents);

                        // adderar de uttagna allergenen som ligger i "content" tillbaka med med strong
                        itemContents += '<strong class="allergi">' + content + '</strong>';
                    } else {
                        // lägger tillbaka utan ändringar
                        itemContents += content;
                        //console.log(content);

                    }
                    // kontrollerar om vi är vid sista elementet i "contents"
                    if (i < item.contents.length - 1) {
                        // om inte lägg till ett ", "
                        itemContents += ', ';
                    }
                });
            }

            // skapar varje vara som skall ligga i listan för kategorierna
            let listItem = $('<li class="p-3 d-flex justify-content-between flex-wrap"></li>').html
                ('<div id="pizza" class="d-flex flex-wrap justify-content-between"><h5>' + item.name + ':' + '</h5>'
                    + '<span id="price">' + item.price + ':-' + '</span>' + '<span id="contents">' + itemContents + '</span></div>' 
                    + '<div id="addPizza"><i class="bi bi-plus-circle"></i></div>');

            // lägger till varorna i itemList
            itemList.append(listItem);

        });

        //lägger till titel i categoryContainer
        categoryContainer.append(categoryTitle);
        // lägger till itemlistan till categoryContainer
        categoryContainer.append(itemList);
        // lägger till category till accordion, som används för att få en snygg collapse på listorna
        accordionContainer.append(categoryContainer);
    });
    // lägg till accordion till meny
    menuContainer.append(accordionContainer); 

    // byter till varukorg
    $('#varukorg-btn').on('click', function () {
        $('#meny-varukorg').removeClass('d-none');
        $('#meny').addClass('d-none');
        $('#meny-btn').removeClass('meny-btn-toggle').addClass('meny-btn');
        $('#varukorg-btn').removeClass('varukorg-btn').addClass('varukorg-btn-toggle');
    });

    // byter till meny
    $('#meny-btn').on('click', function () {
        $('#meny').removeClass('d-none');
        $('#meny-varukorg').addClass('d-none');
        $('#varukorg-btn').removeClass('varukorg-btn-toggle').addClass('varukorg-btn');
        $('#meny-btn').removeClass('meny-btn').addClass('meny-btn-toggle');
    });

    /* Lägga till vara i varukorgen */
    $(document).on('click', '.bi-plus-circle', function (e) {
        // hitta närmaste 'li' element
        let item = $(this).closest('li'); 
        // hitta namnet på varan
        let itemName = item.find('h5').text(); 
         // hitta priset på varan
        let itemPrice = item.find('#price').text();
        // hitta innehållet i varan
        let itemContents = item.find('#contents').clone(); 

        // hitta id för kategorin
        let categoryId = item.parent().attr('id'); 
        // kontrollera om det är en pizza
        let isPizza = categoryId.includes('Pizzor'); 

        let listItem; // variabel för att skapa kopian av varan

        /* Kontroll om kommentar skall finnas för varan i varukorgen */
        if (isPizza) {
            // lägger in med kommentar
            listItem = $('<li class="p-3 d-flex justify-content-between flex-wrap"></li>').html
                ('<div id="pizza" class="d-flex flex-wrap"><h5>' + itemName + '</h5>'
                    + '<span id="price">' + itemPrice + '</span>' + '<span id="contents">' + itemContents.html() + '</span></div>'
                    + '<div id="addComment"><i class="bi bi-chat-text"></i></div>'
                    + '<div id="removePizza"><i class="bi bi-dash-circle"></i></div>'
                    + '<div class="listComment"></div>');
        } else {
            // lägger in utan kommentar
            listItem = $('<li class="p-3 d-flex justify-content-between flex-wrap"></li>').html
                ('<div id="pizza" class="d-flex flex-wrap"><h5>' + itemName + '</h5>'
                    + '<span id="price">' + itemPrice + '</span>'
                    + '<span id="contents">' + itemContents.html() + '</span></div>'
                    + '<div id="removePizza"><i class="bi bi-dash-circle"></i></div>');
        }
        // lägg till varan i varukorgen
        $('#shoppingCart').append(listItem); 
        // uppdatera totalsumman
        updateTotalSum(); 

        /* uppdatera badge med antal li-element som finns i varukorgen */
        let varuNum = $('#meny-varukorg li').length;
        let varuNumText = parseFloat(varuNum);
        //console.log(varuNumText);
        $('.badge').text(varuNumText);
    });



    /* ta bort vara från varukorgen */
    $(document).on('click', '.bi-dash-circle', function (e) {
        let listItem = $(this).closest('li'); // hitta närmaste 'li' element
        listItem.remove(); // ta bort 'li' elementet från DOM

        // uppdatera totalsumman
        updateTotalSum();

        /* uppdatera badge med antal li-element som finns i varukorgen */
        let varuNum = $('#meny-varukorg li').length;
        // parsar värdet för att få in det som text i badgen
        let varuNumText = parseFloat(varuNum);
        //console.log(varuNumText);
        $('.badge').text(varuNumText);
    });

    $(document).on('click', '#addComment', function (e) {
        // hitta närmaste 'li' element
        let listItem = $(this).closest('li'); 
        // letar efter kommentarrutans behållare
        let commentContainer = listItem.find('.comment-container'); 
        // hitta kommentarikonen
        let commentIcon = $(this).children(); 
        // hitta div som kommentar skall läggas
        let commentText = listItem.find('.listComment'); 

        /* togglar kommentaren */
        // kollar om kommentarrutan redan finns uppe
        if (commentContainer.length) {
            // om den finns, ta bort den
            commentContainer.remove();
            // ändrar ikonen till ofylld
            commentIcon.removeClass('bi-chat-text-fill').addClass('bi-chat-text');
        } else {
            // om den inte finns, skapa den
            // skapa en tom inmatningsruta
            let commentBox = $('<textarea class="mt-3" placeholder="Lägg till kommentar"></textarea>');
            // skapar en spara-knapp
            let saveButton = $('<button class="btn btn-sm border-0 rounded-0 mt-3" id="saveButton">Spara</button>');

            // lägg till en händelsehanterare för spara-knappen
            saveButton.on('click', function () {

                // variabel för textareans inmatning
                let comment = commentBox.val();
                //console.log(commentBox.val()); 

                // lägg till kommentaren i kommentarsfältet
                commentText.append('<p class="kommentar">' + comment + '</p>');

                // ta bort textarean och knappen vid save
                commentContainer.remove();
                // ändrar ikonen till ofylld
                commentIcon.removeClass('bi-chat-text-fill').addClass('bi-chat-text');
            });
            // div som textarea och save-knapp skall innehålla
            commentContainer = $('<div class="comment-container"></div>');
            // lägg till inmatningsrutan under behållaren
            commentContainer.append(commentBox);
            // lägg till "spara"-knappen under behållaren
            commentContainer.append(saveButton);
            // lägger till behållaren under listobjektet
            listItem.append(commentContainer);

            // togglar ikonen mellan fylld/ofylld
            if (commentIcon.hasClass('bi-chat-text')) {
                commentIcon.removeClass('bi-chat-text').addClass('bi-chat-text-fill');
            }
        }
        // uppdatera totalsumman
        updateTotalSum();
    });



    // funktion som uppdaterar totalsumman i varukorgne
    function updateTotalSum() {
        // skapar en variabel 'total' och sätter den till 0 för att starta
        let total = 0;

        // går igenom pris för varje vara som är i varukorgen
        $('#meny-varukorg #price').each(function () {

            // hämtar priset som text
            let priceText = $(this).text();
            // konverterar priset till ett tal
            let priceNumber = parseFloat(priceText);
            // adderar varje tal till total 
            total += priceNumber;
        });

        // Uppdatera texten i totalSum
        $('#totalSum').text('total: ' + total + ':-');
    };



    /*  här skall knapparna komma till liv  */

    /* Plus ikon */
    // vid tryck ändra till fylld ikon
    $(document).on('touchstart', '.bi-plus-circle, .bi-dash-circle', function () {
        let currentIcon = $(this);
        let badgeSize = $('.badge');
        if (currentIcon.hasClass('bi-plus-circle')) {
            currentIcon.removeClass('bi-plus-circle').addClass('bi-plus-circle-fill');
            // ändrar badge vid ändring i varukorgen
            badgeSize.addClass('badgeLarge');
        } else if (currentIcon.hasClass('bi-dash-circle')) {
            currentIcon.removeClass('bi-dash-circle').addClass('bi-dash-circle-fill');
            // ändrar badge vid ändring i varukorgen
            badgeSize.addClass('badgeLarge');
        }
    });

    // vid släpp ändra tillbaka ikonen
    $(document).on('touchend', '.bi-plus-circle-fill, .bi-dash-circle-fill', function () {
        let currentIcon = $(this);
        let badgeSize = $('.badge');
        if (currentIcon.hasClass('bi-plus-circle-fill')) {
            currentIcon.removeClass('bi-plus-circle-fill').addClass('bi-plus-circle');
            // ändrar badge vid ändring i varukorgen
            badgeSize.removeClass('badgeLarge');
        } else if (currentIcon.hasClass('bi-dash-circle-fill')) {
            currentIcon.removeClass('bi-dash-circle-fill').addClass('bi-dash-circle');
            // ändrar badge vid ändring i varukorgen
            badgeSize.removeClass('badgeLarge');
        }
    });


    /* meny ikoner */

    // gör meny-knappen större vid tryck
    $(document).on('touchstart', '#meny-btn', function () {
        let currentIcon = $(this);
        currentIcon.addClass('largeBtn');   
        } );
  
    $(document).on('touchend', '#meny-btn', function () {
        let currentIcon = $(this);
        currentIcon.removeClass('largeBtn');   
    });


    // gör varkorg-knappen större vid tryck
    $(document).on('touchstart', '#varukorg-btn', function () {
        let currentIcon = $(this);
        currentIcon.addClass('largeBtn');   
        } );
  
    $(document).on('touchend', '#varukorg-btn', function () {
        let currentIcon = $(this);
        currentIcon.removeClass('largeBtn');   
    });
});




