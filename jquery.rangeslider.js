/**
* RangeSlider jquery plugin.
*
* @author Ivanov Georgiy <xercool1@gmail.com>
* @copyright 2013
* @license GPL
* @package plugin
*/

$(function() {
$.widget( "ui.rangeslider", $.ui.slider, {
    option: function(key, value) {
        if (key == 'value') {
            if (!value) { 
                  return this.options.values[$(this.element).data('ui-handle-index-selected')];
            } else {
                  this.options.values[$(this.element).data('ui-handle-index-selected')] = value;
                  key = 'values';
                  value = this.options.values;
            }
        }
        
        $.ui.slider.prototype.option.apply(this, this.arguments);
        $.ui.slider.prototype.option.apply( this, [key, value] );
    },
            
    _createHandles: function() {
        $.ui.slider.prototype._createHandles.apply(this, this.arguments);
        this.handles.each(function( i ) {
		$( this ).attr( "id", "ui-slider-handle-index-"+i );
        });
    },
            
    _updateRanges: function() {
        $(this.element).find('.ui-slider-range').remove();
        this.range = $('<div></div>')
                .addClass('ui-slider-range')
                .width($(this.handles[this.handles.length-1]).position().left-$(this.handles[1]).position().left)
                .offset({left: $(this.handles[1]).position().left})
                .addClass('ui-widget-header');
        $(this.element).append(this.range);
    },
    _create: function() {
        $(this.element).data('ui-handle-index-selected', 0);
        $.ui.slider.prototype._create.apply(this, arguments);
        this._updateRanges();
    },
    _slide: function() {
        $.ui.slider.prototype._slide.apply(this, arguments);
        this._updateRanges();
    },
    _change: function() {
        $.ui.slider.prototype._change.apply(this, arguments);
        this._updateRanges();
    },
    _mouseCapture: function( event ) {
            console.log('mouse capture');
            
            var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
                    that = this,
                    o = this.options;

            if ( o.disabled ) {
                    return false;
            }

            this.elementSize = {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();

            position = { x: event.pageX, y: event.pageY };
            normValue = this._normValueFromMouse( position );
            distance = this._valueMax() - this._valueMin() + 1;
            
            index = $(this.element).data('ui-handle-index-selected');
            closestHandle = $(this.handles[index]);
            
            /*
            this.handles.each(function( i ) {
                    var thisDistance = Math.abs( normValue - that.values(i) );
                    if (( distance > thisDistance ) ||
                            ( distance === thisDistance &&
                              (i === that._lastChangedValue || that.values(i) === o.min ))) {
                            distance = thisDistance;
                            closestHandle = $( this );
                            index = i;
                    }
            });*/

            allowed = this._start( event, index );
            if ( allowed === false ) {
                    return false;
            }
            
            this._mouseSliding = true;
            this._handleIndex = index;

            closestHandle
                    .addClass( "ui-state-active" )
                    .focus();

            offset = closestHandle.offset();
            mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
            this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
                    left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
                    top: event.pageY - offset.top -
                            ( closestHandle.height() / 2 ) -
                            ( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
                            ( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
                            ( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
            };

            if ( !this.handles.hasClass( "ui-state-hover" ) ) {
                    this._slide( event, index, normValue );
            }
            this._animateOff = true;
            return true;
    },
    _mouseDrag: function(event) {
            return $.ui.slider.prototype._mouseDrag.apply(this, arguments);
    },

    _handleEvents: {
        keydown: $.ui.slider.prototype._handleEvents.keydown,
        click: $.ui.slider.prototype._handleEvents.click,
        mousedown: function(event) {
            var index = $( event.target ).data( "ui-slider-handle-index" );
            $( event.target ).parent().data("ui-handle-index-selected", index);
            this._mouseSliding = true;
        },
        mouseup: function() {
            this._mouseSliding = false;
        },
        keyup: $.ui.slider.prototype._handleEvents.keyup
    },
    _destroy: function() {
        $.ui.slider.prototype._destroy.apply(this, arguments);
    }
});});
