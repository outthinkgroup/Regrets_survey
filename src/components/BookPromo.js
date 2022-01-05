import React from "react";
import styled from "styled-components";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

import { fonts, colors } from "../styles";
import { Container } from "./layout";
import { Button } from "./SurveyButton";
import { testimonies as TESTIMONIES } from "./testimonies.json";

export default function BookPromo() {
  return (
    <div style={{ color: colors.grey[4] }}>
      <div
        style={{
          padding: "20px",
          backgroundImage: `url(https://www.danpink.com/wp-content/uploads/2021/11/crumpled-white-paper-2021-08-29-08-09-57-utc-scaled.jpg)`,
        }}
      >
        <Container>
          <BookPromoContainer>
            <div>
              <img
                src="https://www.danpink.com/wp-content/uploads/2021/11/POWER-OF-REGRET-DAN-PINK-BOOK-JACKET.png"
                alt="Dan Pink's Book, The Power of Regret"
              />
            </div>
            <div className="content">
              <div className="tag">Pre-order Dan's New Book!</div>
              <h2 className="title">
                The Power of Regret: How Looking Backward Moves Us Forward
              </h2>
              <p>
                In Daniel Pink's new book, find out how regret, our most
                misunderstood emotion, can be the pathway to our best life.
              </p>
              <div className="flex-row">
                <Button
                  as="a"
                  href="https://www.danpink.com/#modal-61857743ccfcf"
                >
                  Pre-order the Book
                </Button>
                <Button as="a" href="https://www.danpink.com/tpor-book#details">
                  More About the Book
                </Button>
              </div>
            </div>
          </BookPromoContainer>
        </Container>
      </div>
      <TestimonyWrapper>
        <Container>
          <div>
            <h2>Praise for the Power of Regret</h2>
            <TestimonialSlider testimonies={TESTIMONIES} />
          </div>
        </Container>
      </TestimonyWrapper>
    </div>
  );
}
const TestimonialSlider = ({ testimonies }) => {
  return (
    <Carousel autoPlay infiniteLoop className="testimonial-slider">
      {testimonies.map((testimony, index) => {
        return <Testimonial key={index} {...testimony} />;
      })}
    </Carousel>
  );
};

const Testimonial = ({ name, quote, image }) => {
  return (
    <div className="testimonial">
      <div className="image">
        <img src={image} alt={name} />
      </div>
      <div className="content">
        <div className="name">{name}</div>
        <div className="quote" dangerouslySetInnerHTML={{ __html: quote }} />
      </div>
    </div>
  );
};

const BookPromoContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.grey[4]};
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
    .content {
      order: 1;
    }
    & > :not(.content) {
      order: 2;
    }
  }
  gap: 1rem;

  img {
    margin-block: 0;
  }
  .content {
    max-width: 550px;
  }
  h2 {
    line-height: 1.2;
  }
  p {
    margin-top: 0;
    font-size: ${fonts.sizes.heading[1]};
  }
  .tag {
    display: inline-block;
    font-size: 0.782rem;
    font-weight: ${fonts.weights[2]};
    font-family: ${fonts.family};
    color: #000;
    background: #e8db3d;
    padding: 0.1em 1em;
    margin-bottom: 1rem;
  }
  .flex-row {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
  }
`;

const TestimonyWrapper = styled.div`
  padding: 20px;
  padding-top: 60px;
  background-image: url(https://www.danpink.com/wp-content/uploads/2021/11/large-triangles.svg);
  color: white;
  h2 {
    font-size: 24px;
    text-align: center;
    font-weight: ${fonts.weights[2]};
    font-family: ${fonts.family};
  }
  .testimonial-slider {
    .testimonial {
      max-width: 700px;
      padding: 35px 30px;
      align-items: center;
      display: flex;
      gap: 40px;
      .image {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border-radius: 50%;
        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      .content {
        text-align: left;
        flex: 1;
        .name {
          font-size: ${fonts.sizes.heading[1]};
          font-weight: ${fonts.weights[3]};
          font-family: ${fonts.family};
        }
        .quote {
          font-style: italic;
          font-size: ${fonts.sizes.copy};
          font-weight: ${fonts.weights[2]};
          font-family: ${fonts.family};
          .highlight {
            color: #ffff00;
          }
        }
      }
      @media (max-width: 700px) {
        flex-direction: column;
        align-items: center;
        .content {
          order: 1;
          text-align: center;
        }
        & > :not(.content) {
          order: 2;
        }
      }
    }
  }
`;
