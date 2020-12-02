//paper_id, paper_shortname, paper_year, paper_title, paper_authors, paper_img, paper_link
add_paper("alexnet", "Alexnet", "2012", "ImageNet Classification with Deep Convolutional Neural Networks",
		  "Alex Krizhevsky, Ilya Sutskever, Geoffrey E. Hinton", "alexnet",
		  "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf", "modal_alexnet");

add_paper("vggnet", "VGG", "2015", "Very Deep Convolutional Networks for Large-Scale Image Recognition",
		  "Karen Simonyan, Andrew Zisserman", "vggnet", "https://arxiv.org/pdf/1409.1556.pdf", "modal_vgg");

add_paper("nin", "NiN", "2014", "Network In Network",
      "Min Lin, Qiang Chen, Shuicheng Yan", "nin", "https://arxiv.org/pdf/1312.4400.pdf", "modal_nin");

add_paper("googlenet", "GoogleNet", "2014", "Going Deeper with Convolutions",
      "Christian Szegedy, Wei Liu, Yangqing Jia, Pierre Sermanet, Scott Reed, Dragomir Anguelov, Dumitru Erhan, Vincent Vanhoucke, Andrew Rabinovich", "googlenet", "https://arxiv.org/pdf/1409.4842.pdf", "modal_googlenet");

add_paper("resnet", "ResNet", "2015", "Deep Residual Learning for Image Recognition",
      "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun", "resnet", "https://arxiv.org/pdf/1512.03385.pdf", "modal_resnet");

add_paper("densenet", "DenseNet", "2016", "Densely Connected Convolutional Networks",
      "Gao Huang, Zhuang Liu, Laurens van der Maaten, Kilian Q. Weinberger", "densenet", "https://arxiv.org/pdf/1608.06993.pdf", "modal_densenet");


function add_paper(paper_id, paper_shortname, paper_year, paper_title, paper_authors, paper_img, paper_link, modal_id) {

	elem = document.getElementById(paper_id);

	html_text = "";
	html_text = `<!-- Button trigger modal -->
                <button type="button" class="btn btn-primary button_paper" data-toggle="modal" data-target="#`+modal_id+`">
                  <span class="paper_shortname">`+paper_shortname+`</span>
                  <br/>
                  <span class="paper_year">`+paper_year+`</span>
                  <br/>
                  <span class="paper_title">`+paper_title+`</span>
                </button>

                <!-- Modal -->
                <div class="modal fade bd-example-modal-lg" id="`+modal_id+`" tabindex="-1" role="dialog" aria-hidden="true">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <div class="container-fluid">

                          <div class="row">
                            <div class="col-lg-10 col-10">
                              <h5 class="modal-title">`+paper_title+`</h5>
                            </div>
                            <div class="col-lg-2 col-2">
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                          </div>

                          <div class="row">
                            <div class="col-lg-12 col-12">
                              <p class="authors">`+paper_authors+`
                              <a href="`+paper_link+`"><button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#">Paper</button></a></p>
                            </div>
                          </div>


                        </div>
                      </div>

                      <div class="modal-body">
                        <div class="container-fluid">
                          <div class="row">
                            <div class="col-lg-10 col-12 mx-auto">
                              <img class="paper_img" src="images/basic/`+paper_img+`.png">
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="modal-footer">
                        <div class="col-lg-10 col-10">
                          <span class="modal-title" id="exampleModalLongTitle">`+paper_title+`</span>
                        </div>
                        <div class="col-lg-2 col-2">
                          <a href="`+paper_link+`"><button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#">Paper</button></a>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>`;

	elem.innerHTML = html_text;
}