import { useParams } from 'react-router-dom';
import Map from '../../components/map/map';
import Offers from '../../components/offers/offers';
import Rating from '../../components/rating/rating';
import ReviewList from '../../components/review-list/review-list';
import RoomGalery from '../../components/room-galery/room-galery';
import {Offer } from '../../types/offer';
import { Review } from '../../types/review';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useEffect } from 'react';
import { AuthorizationStatus, compareByDate, sortOffers } from '../../const';
import CommentSubmissionForm from '../../components/comment-submission-form/comment-submission-form';
import { getAuthorizationStatus } from '../../store/user-process/user-process.selectors';
import { getNearbyOffers, getOffer, getOffers, getReviews } from '../../store/main-data/main-data.selectors';
import Layout from '../../components/layout/layout';
import { getLocationName, getSortingMethod } from '../../store/main-process/main-process.selectors';
import Bookmark from '../../components/bookmark/bookmark';
import { fetchNearbyOffersAction, fetchOfferAction } from '../../store/api-actions/offers-api-actions';
import { fetchReviewsAction } from '../../store/api-actions/reviews-api-actions';

function RoomScreen(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
      dispatch(fetchReviewsAction(id));
    }
  }, [dispatch, id]);

  const isLoggedIn = useAppSelector(getAuthorizationStatus) === AuthorizationStatus.Auth;
  const nearbyOffers: Offer[] = useAppSelector(getNearbyOffers);
  const offer: Offer | null | undefined = useAppSelector(getOffer);
  const offerReviews: Review[] = useAppSelector(getReviews);
  const latestReviews = offerReviews.slice(-10).sort(compareByDate);

  const offers: Offer[] = useAppSelector(getOffers);
  const selectedCityName = useAppSelector(getLocationName);
  const selectedSortingMethod = useAppSelector(getSortingMethod);

  const filteredAndSortedOffers: Offer[] = sortOffers(offers,selectedSortingMethod)
    .filter((offerItem) => offerItem.city.name === selectedCityName);

  if(offer){
    const { title, price, rating, type, isPremium, bedrooms, maxAdults, host, description, goods, city, isFavorite}: Offer = offer;
    const offerId = offer.id;
    const nearbyOffersWithCurrent: Offer[] = [
      ...nearbyOffers,
      ...(offer ? [offer] : []),
    ];

    return(
      <Layout className="page">
        <main className="page__main page__main--property">
          <section className="property">
            <RoomGalery offer={offer}/>
            <div className="property__container container">
              <div className="property__wrapper">
                {isPremium ? <div className="property__mark"><span>Premium</span></div> : ''}
                <div className="property__name-wrapper">
                  <h1 className="property__name">
                    {title}
                  </h1>
                  <Bookmark isProperty offerId={offerId} isFavorite={isFavorite}/>
                </div>
                <div className="property__rating rating">
                  <Rating rating={rating}/>
                  <span className="property__rating-value rating__value">{rating}</span>
                </div>
                <ul className="property__features">
                  <li className="property__feature property__feature--entire">
                    {type}
                  </li>
                  <li className="property__feature property__feature--bedrooms">
                    {bedrooms} Bedrooms
                  </li>
                  <li className="property__feature property__feature--adults">
                    Max {maxAdults} adults
                  </li>
                </ul>
                <div className="property__price">
                  <b className="property__price-value">&euro;{price}</b>
                  <span className="property__price-text">&nbsp;night</span>
                </div>
                <div className="property__inside">
                  <h2 className="property__inside-title">What&apos;s inside</h2>
                  <ul className="property__inside-list">
                    {goods.map((good) => (
                      <li key={good} className="property__inside-item">{good}</li>
                    ))}
                  </ul>
                </div>
                <div className="property__host">
                  <h2 className="property__host-title">Meet the host</h2>
                  <div className="property__host-user user">
                    <div className={`property__avatar-wrapper ${host.isPro ? 'property__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                      <img className="property__avatar user__avatar" src={host.avatarUrl} width="74" height="74" alt="Host avatar" />
                    </div>
                    <span className="property__user-name">
                      {host.name}
                    </span>
                    <span className="property__user-status">
                      {host.isPro ? 'Pro' : ''}
                    </span>
                  </div>
                  <div className="property__description">
                    <p className="property__text">
                      {description}
                    </p>
                  </div>
                </div>
                <section className="property__reviews reviews">
                  <ReviewList reviews={latestReviews}/>
                  {isLoggedIn && <CommentSubmissionForm/>}
                </section>
              </div>
            </div>
            <Map city={city} activeOfferId={offerId} offers={nearbyOffersWithCurrent} wrapperClassName={'property__map'}/>
          </section>
          <div className="container">
            <section className="near-places places">
              <h2 className="near-places__title">Other places in the neighbourhood</h2>
              <div className="near-places__list places__list">
                <Offers isNearby filteredAndSortedOffers={filteredAndSortedOffers}/>
              </div>
            </section>
          </div>
        </main>
      </Layout>
    );
  }
  return null;
}
export default RoomScreen;
