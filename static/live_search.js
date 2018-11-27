let input = document.querySelector(".search_box");

document.querySelector(".search_box")
            .addEventListener("keyup", function() { 

                var xmlhttp =  new XMLHttpRequest();
                xmlhttp.open("GET","get_posts",true);

                xmlhttp.onreadystatechange = function() {
                    
                    if( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
                    {

                        var posts = JSON.parse( xmlhttp.responseText );

                        console.log(posts);



                        for( var i = 0; i < posts.length; i++ )
                        {
                            var div = document.createElement("div"), 
                                content =  posts[i].title;

                            div.className = "search_box";

                            div.innerHTML = content;

                            input.appendChild(div);

                        }

                                  
                        });*/

                    }
                

                };

                xmlhttp.send(input.value);  
            });


