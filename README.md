iKnow Total Study Time Bookmarklet
==================================

This is a bookmarklet to get the total study time of [iKnow](http://iknow.jp/) as a CSV file.


Usage
-----

1. Download [this bookmarklet](https://rawgit.com/shingo45endo/iknow-studytime/master/iknow-studytime.url) and D&D it to browser's bookmark.
2. Move to [iKnow calendar](https://iknow.jp/home/calendars).
3. Choose the bookmark.
4. The monthly calendar is flipped through in a retrograde direction and the study time of each day is stored automatically.
5. Download the CSV file.
	* If your browser doesn't support bookmarklets (ex. Microsoft Edge), after entering Developer Mode by hitting <kbd>F12</kbd>, input the following code snippet on Console tab.

```javascript
(function(){var a='https://rawgit.com/shingo45endo/iknow-studytime/master/iknow-studytime.js?'+Date.now();var d=document;var e=d.createElement('script');e.charset='utf-8';e.src=a;d.getElementsByTagName('head')[0].appendChild(e);})();
```


License
-------

MIT


Author
------

[shingo45endo](https://github.com/shingo45endo)
