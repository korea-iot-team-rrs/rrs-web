import React from "react";
import "../../styles/MainContainer.css";
import dogImgsrc from "../../assets/images/mainPageDog.png";
import dogPowImgsrc from "../../assets/images/dog_pow.jpg";
import dogIllust01 from "../../assets/images/dogIllust01.jpg";
import dogIllust02 from "../../assets/images/dogIllust02.jpeg";
import dogIllust03 from "../../assets/images/dogIllust03.jpg";
import dogIllust04 from "../../assets/images/dogIllust04.jpg";
import dog01 from "../../assets/images/dog01.jpg";
import dog02 from "../../assets/images/dog02.jpg";
import dog03 from "../../assets/images/dog03.jpg";
import dog04 from "../../assets/images/dog04.jpg";
import dog05 from "../../assets/images/dog05.jpg";
import dogVedioSrc from "../../assets/media.d.ts/mainPage_highFive.mp4";
import { LuDog } from "react-icons/lu";
import { FaMapMarkedAlt } from "react-icons/fa";
import { CiMemoPad } from "react-icons/ci";

export default function MainContainer() {
  return (
    <>
      <div className="page-wrapper">
        <div className="global-styles w-embed"></div>
        <div className="main-wrapper">
          <section className="section-bento-grid">
            <div className="container-large page-padding">
              <div className="spacer-xl-start spacer-xl-end">
                <div className="w-layout-grid bento-grid">
                  {/* Intro Section */}
                  <div
                    id="w-node-adfb12b0-add9-49c1-a4d6-ec1c299aff63-bbc9965d"
                    className="bento-grid-item is-intro"
                  >
                    <div className="bento-grid-intro-inner">
                      <h2 className="heading-style-h3">
                        당신이 없는 시간,
                        <br />
                        저희가 함께합니다.
                      </h2>
                      <div className="spacer-xs-start spacer-sm-end">
                        <p className="copy-small">
                          당신의 반려동물을 책임질 믿을 수 있는 펫시터를 쉽게
                          만나보세요.
                          <br />
                          반려동물을 진심으로 아끼고 사랑하는 검증된 펫시터,
                          <br />
                          반려동물의 하루를 행복하게 만들어 줄 전문가들을 지금
                          찾아보세요.
                        </p>
                      </div>
                    </div>
                    <a
                      href="/dang-sitter"
                      target="_blank"
                      rel="noreferrer"
                      className="button w-button"
                    >
                      DangSitter 바로가기
                    </a>
                    <div className="bento-shine"></div>
                  </div>
                  {/* Video Section */}
                  <div
                    id="w-node-edda67fd-4205-96e8-a507-1765792a563b-bbc9965d"
                    className="bento-grid-item is-video"
                  >
                    <div
                      data-poster-url="https://cdn.prod.website-files.com/65e61a1d35c7443508c143ad/65e61efc1368bfb39dd33305_deepmind-poster-00001.jpg"
                      data-video-urls={dogVedioSrc}
                      className="bento-background-video w-background-video w-background-video-atom"
                    >
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                          backgroundImage:
                            "url('https://example.com/video-poster.jpg')",
                        }}
                      >
                        <source src={dogVedioSrc} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                  {/* Slideshow Section */}
                  <div
                    id="w-node-_38862536-003d-4fd6-45ba-897dcf0aa884-bbc9965d"
                    className="bento-grid-item is-slideshow"
                  >
                    <div className="bento-shine"></div>
                    <div className="bento-slider-do-not-touch"></div>
                    <div className="bento-slider w-slider">
                      <div className="bento-slide is-mask w-slider-mask">
                        <div className="bento-slide w-slide">
                          <div className="bento-slide-inner">
                            <div className="bento-slide-top">
                              <img
                                src={dog05}
                                loading="lazy"
                                alt=""
                                className="bento-grid-client-image is-1"
                              />
                              <img
                                src={dog02}
                                loading="lazy"
                                alt=""
                                className="bento-grid-client-image is-2"
                              />
                              <img
                                src={dog03}
                                loading="lazy"
                                alt=""
                                className="bento-grid-client-image is-3"
                              />
                              <img
                                src={dog04}
                                loading="lazy"
                                alt=""
                                className="bento-grid-client-image is-4"
                              />
                            </div>
                            <div className="bento-slide-bottom">
                              <div className="heading-style-h3">
                                다양한
                                <br />
                                댕소통을
                                <br />
                                나누어 보아요!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Remaining Sections */}
                  <div
                    id="w-node-a5425cee-6043-0d4d-20be-8c34ccc52aa3-bbc9965d"
                    className="bento-grid-item is-person"
                  >
                    <img
                      src={dogImgsrc}
                      alt=""
                      className="bento-person-image"
                    />
                  </div>
                  <div
                    id="w-node-_2d8cf5a3-3579-13bc-fbc6-17fa3e9c891f-bbc9965d"
                    className="bento-grid-item is-social"
                  >
                    <div className="bento-shine"></div>
                    <div className="social-icons1_component">
                      <a
                        href="/announcements"
                        className="social-icons1_link w-inline-block"
                      >
                        <LuDog size={80} />
                        공지사항
                      </a>
                      <br />
                      <a
                        href="/pet-diary"
                        className="social-icons1_link w-inline-block"
                      >
                        <CiMemoPad size={80} />
                        댕수첩
                      </a>
                      <br />
                      <a
                        href="/pet-road"
                        className="social-icons1_link w-inline-block"
                      >
                        <FaMapMarkedAlt size={80} />
                        댕로드
                      </a>
                    </div>
                  </div>
                  <div
                    id="w-node-_34d2573c-f9c2-1043-f00e-fc0590bd4f9c-bbc9965d"
                    className="bento-grid-item is-mood-image"
                  >
                    <img
                      src={dogIllust03}
                      alt=""
                      className="bento-mood-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
