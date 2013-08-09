Piki
===========

This is skinnable, Blue State-created select replacement jQuery plugin. Because some people are picky about picking.

## Usage

```javascript
jQuery(document).ready(function($){
    $('select').blueSelect();
});
```

## Options

Right now the only option is `icon` which you use like this:

```javascript
jQuery(document).ready(function($){
    $('select').blueSelect({
        'icon' : '&caron;'
    });
});
```