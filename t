<input id="p1" class="poll_option" type="text" name="poll_option1" palceholder="option 1" ng-keydown="keyPress($event);">
<input type="text" name="poll_option0" id="p0" placeholder="option 0" required="" ng-keydown="keyPress($event);" class="poll_option">

script.
                        l = '#{options}'.split(',');

                        for (var z = 0; z < l.length; z++) {
                            var v = document.createElement('canvas');
                            v.setAttribute('id', 'textCanvas' + z);
                            document.getElementById('ul_ul').appendChild(v);
                        };

                        for(var i = 0; i < l.length; i++){
                            // var cid = 'textCanvas' + i;
                            var parent_ = document.getElementById('ul_ul');
                            var o = document.createElement('img');
                            o.setAttribute('id', 'image' + i);

                            parent_.appendChild(o);
                            //document.getElementById('image' + i).style.height = '30px';
                            //document.getElementById('image' + i).style.width = '200px';
                        };

                        for(var x = 0; x < l.length; x++){
                            var cavid = 'textCanvas' + x;
                            var imgid = 'image' + x;
                            var tCtx = document.getElementById(cavid).getContext('2d');
                            document.getElementById(cavid).style.display = 'none';
                            var imageElem = document.getElementById(imgid);
                            tCtx.canvas.width = tCtx.measureText(l[x] + '             ').width;
                            tCtx.canvas.height = 30;
                            tCtx.fillText(l[x], 2, 20);
                            imageElem.src = tCtx.canvas.toDataURL();
                        }


0 {"title":"Best Apink Member","scores":["EunJi: 6","Bomi: 3","Chorong: 2","NaEun: 1","Hayoung: 2","NamJoo: 1"]}

1 {"title":"Best Girls Day Member","scores":["Minah: 0","Sojin: 0","Yura: 0","Hyeri: 0"]}