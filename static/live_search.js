let input = document.querySelector(".search_box");
let parent_ = document.querySelector(".search");

const null_post = "Nenhum Post";

document.querySelector(".search_box")
            .addEventListener("keyup", function() { 

                var xmlhttp =  new XMLHttpRequest();
                xmlhttp.open("GET","get_posts?q="+input.value,true);

                xmlhttp.onreadystatechange = function() {
                    
                    if( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) 
                    {

                        var posts = JSON.parse( xmlhttp.responseText );

                        console.log(posts);

                        let child_list = document.querySelectorAll( ".live_search_list" );

                        child_list.forEach( function(item,index){
                            parent_.removeChild(item);
                        });

                        if( input.value != null && input.value != "")
                        {
                            var list = document.createElement("div"); 
                            list.className = "live_search_list";

                            parent_.appendChild(list);
                            
                            if( posts[0].title != null_post )
                            {
                                for( var i = 0; i < posts.length; i++ )
                                {
                                    let div = document.createElement("div"), 
                                        content =  posts[i].title.trim();

                                    console.log(content);

                                    div.className = "live_search";
                                    div.innerHTML = content;

                                    console.log(window.location.href);
                                    
                                    div.onclick = function()
                                    {
                                        window.location.assign("/buscar?q="+div.innerHTML);
                                    };


                                    list.appendChild(div);
                                }
                            }

                        }
                                  

                    }
                

                };

                xmlhttp.send();  
            });

           
