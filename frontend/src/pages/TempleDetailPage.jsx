import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import '../styles/TempleDetailPage.css';

function TempleDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    visitorName: ''
  });
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchTempleDetail();
  }, [id]);

  const fetchTempleDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/temples/${id}`);
      setTemple(response.data);
      setImages(response.data.images || []);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch temple detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/reviews/temples/${id}`, newReview);
      setNewReview({ rating: 5, comment: '', visitorName: '' });
      fetchTempleDetail();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/likes/temples/${id}`);
      } else {
        await api.post(`/likes/temples/${id}`);
      }
      setLiked(!liked);
      fetchTempleDetail();
    } catch (error) {
      console.error('Failed to like:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (!temple) {
    return <div className="error">{t('common.notFound')}</div>;
  }

  return (
    <div className="temple-detail-page">
      <div className="container">
        {/* 图片轮播 */}
        {images.length > 0 && (
          <div className="image-carousel">
            <div className="carousel-main">
              <img
                src={images[currentImageIndex]?.url || '/placeholder.jpg'}
                alt={temple.name}
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            </div>
            {images.length > 1 && (
              <>
                <button onClick={prevImage} className="carousel-btn prev">
                  ❮
                </button>
                <button onClick={nextImage} className="carousel-btn next">
                  ❯
                </button>
              </>
            )}
            <div className="carousel-thumbnails">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={`${temple.name} ${idx}`}
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 基本信息 */}
        <div className="temple-info">
          <div className="info-header">
            <h1>{temple.name}</h1>
            <button
              className={`like-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              ❤️ {temple.like_count || 0}
            </button>
          </div>

          <div className="info-meta">
            <span className="sect">{temple.sect}</span>
            <span className="rating">⭐ {temple.average_rating || 0}</span>
            <span className="reviews">
              {temple.review_count} {t('common.reviews')}
            </span>
          </div>

          <div className="info-details">
            <p>
              <strong>{t('temple.address')}:</strong> {temple.address}
            </p>
            {temple.phone && (
              <p>
                <strong>{t('temple.phone')}:</strong> {temple.phone}
              </p>
            )}
            {temple.email && (
              <p>
                <strong>{t('temple.email')}:</strong> {temple.email}
              </p>
            )}
            {temple.website && (
              <p>
                <strong>{t('temple.website')}:</strong>{' '}
                <a href={temple.website} target="_blank" rel="noopener noreferrer">
                  {temple.website}
                </a>
              </p>
            )}
          </div>

          <div className="description">
            <h2>{t('temple.description')}</h2>
            <p>{temple.description}</p>
          </div>
        </div>

        {/* 评价区域 */}
        <div className="reviews-section">
          <h2>{t('temple.reviews')}</h2>

          {/* 提交评价表单 */}
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="form-group">
              <label>{t('temple.visitorName')}</label>
              <input
                type="text"
                value={newReview.visitorName}
                onChange={(e) =>
                  setNewReview({ ...newReview, visitorName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>{t('temple.rating')}</label>
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: parseInt(e.target.value) })
                }
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 {t('temple.stars')}</option>
                <option value="4">⭐⭐⭐⭐ 4 {t('temple.stars')}</option>
                <option value="3">⭐⭐⭐ 3 {t('temple.stars')}</option>
                <option value="2">⭐⭐ 2 {t('temple.stars')}</option>
                <option value="1">⭐ 1 {t('temple.stars')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('temple.comment')}</label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                rows="4"
              />
            </div>

            <button type="submit" className="submit-btn">
              {t('temple.submitReview')}
            </button>
          </form>

          {/* 评价列表 */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p>{t('temple.noReviews')}</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <strong>{review.visitor_name}</strong>
                    <span className="rating">⭐ {review.rating}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <small className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TempleDetailPage;
