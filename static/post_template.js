function generatePosts (data) {
	let template = `{{#each post_list}}
		<div class="post">
			<div class="post_details">
				<div class="vote_region">

					<div class="icon">
						<span class="icon-upvote"></span>
					</div>

					<div class="counter_post">{{score}}</div>

					<div class="icon">
						<span class="icon-downvote"></span>
					</div>
				</div>
			</div>
			<div class="post_child">
				<div class="inner_post">
					<div class="post_header">
						<div class="post_info">
							<div class="img_sub_post">
								<img src="https://styles.redditmedia.com/t5_2qh9i/styles/communityIcon_j68bk74k14o01.png" alt="imagem_rBrasil" />
							</div>
							<div class="sub_and_details">
								<span class="sub_name">r/brasil</span>
								<span class="post_time">Posted by {{username}}</span>
							</div>
						</div>
						<div class="post_name">
							<span>{{title}}</span>	
						</div>
					</div>
					<div class="post_content">
						<span class="post_text">{{content}}</span>
						<img class="content_img" src="{{image_path}}" alt="{{title}}" />
					</div>
				</div>
				<div class="comments_and_stuff">
					<div class="cbar_opt comments">
						<div>
							<span class="c_icon"></span>
							<div>123 Comments</div>
						</div>
					</div>
					<div class="cbar_opt share">
						<div>
							<span class="s_icon"></span>
							<div>Share</div>
						</div>
					</div>
					<div class="cbar_opt save">
						<div>
							<span class="save_icon"></span>
							<div>Save</div>
						</div>
					</div>
					<div class="cbar_opt hidden_menu">
						<div>
							<span class="m_icon"></span>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	{{/each}}`
	let compiledTemplate = Handlebars.compile(template);
	let result = compiledTemplate(data);
	let post_list = document.querySelector(".post_list");

	post_list.innerHTML = result;
}
