function groupsCntrl( opts ) {
    var self = this,
        parent = document.getElementById( opts.parent ),
        btns = document.querySelectorAll( opts.btns ),
        list = document.querySelectorAll( opts.list ),
        names = document.querySelectorAll ( opts.names ),
        search_field = document.getElementById( opts.search_field );
    
    //получаем список имен
    function getNames() {
        var arr_names = [];
        for (var j = 0; j < names.length; j++ ) {
            arr_names.push( names[j].innerHTML );
        }
        return arr_names;
    } 
    
    //получаем то, что ввел пользователь в поле поиска
    function getVal( field ) {
        if ( field.value ) {
            return field.value;
        }
    }
    
    //ищем участника группы по первым трем символам, введенным в поле поиска
    function getGroupItemNumb ( str, arr ) {
        if ( str && str.length > 3 ) {//ищем совпадения по первым 4-м символам
            var regexp = new RegExp( str, 'i' );
            for ( var i in arr ) {
                if ( regexp.test( arr[i] )) {
                    return i;
                }
            }
        }
    }
    
    //создаем каркас сообщения
    function createMessage( content ) {
        var block = document.createElement( 'div' );
        block.className = 'b-message';
        block.id = 'message';
        block.appendChild( document.createTextNode( content ) );
        if ( document.getElementById('message') == null ) {
            parent.appendChild( block );
        }
    }
    
    //показываем сообщение о том, что ничего не найдено, если нет совпадений
    function showMessageNotFind() {
        createMessage( 'Сотрудник не найден' );
    }
    
    //скрываем сообщение, если оно не скрыто
    function hideMessage() {
        var message = document.getElementById('message');
        if ( message ) {
            parent.removeChild( message );
        }
    }
    
    //закрываем все несовпадения
    this.closeGroupItems = function() {
        for (var j = 0; j < list.length; j++ ) {
            var item = list[j];
            item.style.display = 'none';
        }
    }
    
    //открываем совпадение
    this.openGroupItem = function( count ) {
        hideMessage();
        if ( count ) {
            var item = list[count];
            self.closeGroupItems();
            item.style.display = 'block';
        }
    }
    
    //получаем номер группы
    function getTargetGroup( el ) {
        return el.getAttribute( 'data-target-group' );
    }
    
    //открываем нужную, остальное скрываем
    this.openGroup = function ( attrb ) {
        hideMessage();
        for (var c = 0; c < list.length; c++ ) {
            var item = list[c],
                item_group = item.getAttribute( 'data-group' );
            
            item_group != attrb ? item.style.display = 'none' : item.style.display = 'block';
        }
    }
    
    //открываем все
    this.openAll = function () {
        hideMessage();
        for (var c = 0; c < list.length; c++ ) {
            list[c].style.display = 'block';
        }
    }
    
    //очистка поля при наступлении события onblur
    function clearFieldSearch( field ) {
        field.value = '';
    }
    
    for ( var i = 0; i < btns.length; i++ ) {
        var curr = btns[i];
        
        curr.onclick = function() {
            var attr = getTargetGroup( this );
            attr != 'all' ? self.openGroup( attr ) : self.openAll( attr );
        }
    }
    
    search_field.onkeyup = function(){
        var count = getGroupItemNumb( getVal( this ), getNames()),
            _this = this,
            str = getVal( this );

        if ( count ) {
            self.openGroupItem ( count );
        } else if ( !count && str && str.length > 3 ) {
            self.closeGroupItems();
            showMessageNotFind();
        }
        
        _this.onblur = function() {
            clearFieldSearch( this );
        }
    }
    
}

window.onload = function() {
    var group_cntrl = new groupsCntrl({
        parent: 'tab-content',
        btns: '.js_btn',
        list: '[data-group]',
        names: '.js_name',
        search_field: 'search'
    });
}