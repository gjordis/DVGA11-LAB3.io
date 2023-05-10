'use strict'

$(document).ready(function() {
    let menuContainer = $('#meny'); // variabel för vart jag skall lägga innehållet med menyn

    // skapar en accordionContainer
    let accordionContainer = $('<div id="accordion"></div>');

    $.each(menu, function(category, items) {
        
        //variabel för att ge varje kategori ett unikt id(för att hantera expand/collapse). Replace anänds för att ta bort mellanslagen i kategori namnet.
        let categoryId = 'category' + category.replace(/\s+/g, '_');

        // 
        let categoryContainer = $('<div class="kategori"></div>');
        let categoryTitle = $('<h4 class="category-title collapsed p-3" data-bs-toggle="collapse" data-bs-target="#' + categoryId + '" role="button" aria-expanded="false" aria-controls="' + categoryId + '"></h4>').text(category);

        // skapar list-items som är dolda från början
        let itemList = $('<ul class="item-list mb-0 collapse list-unstyled" id="' + categoryId + '" data-bs-parent="#accordion"></ul>'); 

        $.each(items, function(index, item) {
            let itemContents = '';
            if(item.contents){
                $.each(item.contents, function(i, content) {
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
            + '<span id="price">' + item.price  + ' :-' + '</span>' + '<span id="contents">' + itemContents + '</span></div>' + '<div id="addPizza"><i class="bi bi-plus-circle"></i></div>' + '<div id="addComment"><i class="bi bi-chat-text"></i></div>');
            
            
            itemList.append(listItem);
        
        });

        categoryContainer.append(categoryTitle);
        categoryContainer.append(itemList);

        accordionContainer.append(categoryContainer); // lägg till category till accordion
    });

    menuContainer.append(accordionContainer); // lägg till accordion till meny

    // byter till varukorg
    $('#varukorg-btn').on('click', function(){
        $('#meny-varukorg').removeClass('d-none');
        $('#meny').addClass('d-none');
    });
    // byter till meny
    $('#meny-btn').on('click', function(){
        $('#meny').removeClass('d-none');
        $('#meny-varukorg').addClass('d-none');
    });

    $('.bi').on('click', function(e){
        let listItem = $(this).closest('li'); // hitta närmaste 'li' element
        let clonedItem = listItem.clone(); // skapa en klon av 'li' elementet
    
        clonedItem.find('.bi').removeClass('bi bi-plus-circle').addClass('bi bi-dash-circle'); // byta plus ikon till dash
    
        $('#shoppingCart').append(clonedItem); // lägg till klonen till varukorgen
    });
    
    $(document).on('click', '.bi-dash-circle', function(e){
        let listItem = $(this).closest('li'); // hitta närmaste 'li' element
        listItem.remove(); // ta bort 'li' elementet från DOM
    });
    
});
