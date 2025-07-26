// app/companies/[firmName]/CompanyDetailsClientComponent.tsx
"use client"; // This makes it a Client Component

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CompanyDetailData, Review, CompanyStatistics, Pagination } from '@/types'; 

// Helper component for star rendering (for ratings within a review)
function StarRating({ rating }: { rating: number | null }) {
    if (rating === null || isNaN(rating)) return <span className="text-gray-400 text-lg">N/A</span>;

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {Array(fullStars).fill(0).map((_, i) => (
                <span key={`full-${i}`} className="text-yellow-400 text-xl">★</span>
            ))}
            {halfStar && <span className="text-yellow-400 text-xl">½</span>}
            {Array(emptyStars).fill(0).map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
            ))}
            <span className="ml-2 text-gray-700 font-medium">({Number(rating).toFixed(1)}/5)</span>
        </div>
    );
}

function StatItem({ label, value }: { label: string; value: number | string | null }) {
    const displayValue = value === null ? 'N/A' : (typeof value === 'number' ? `${value.toFixed(1)}/5` : value);
    return (
        <p className="text-gray-700 text-lg mb-1">
            <strong className="font-semibold">{label}:</strong> {displayValue}
        </p>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const getRecommendationText = (char: 'o' | 'x' | 'v' | null) => {
        switch (char) {
            case 'o': return 'Recommends';
            case 'x': return 'Does not Recommend';
            case 'v': return 'Mixed Recommendation';
            default: return 'N/A';
        }
    };

    const getApprovalText = (char: 'o' | 'x' | 'v' | null) => {
        switch (char) {
            case 'o': return 'Approves of CEO';
            case 'x': return 'Does not Approve of CEO';
            case 'v': return 'Mixed Approval';
            default: return 'N/A';
        }
    };

    const getOutlookText = (char: 'o' | 'x' | 'v' | 'r' | null) => {
        switch (char) {
            case 'v': return 'Positive Outlook';
            case 'x': return 'Negative Outlook';
            case 'r': return 'Neutral Outlook';
            default: return 'N/A';
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{review.headline || 'No Headline'}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-3">
                {review.job_title && <span className="mr-2">{review.job_title}</span>}
                {review.current_status && <span className="mr-2">| {review.current_status}</span>}
                {review.location && <span className="mr-2">| {review.location}</span>}
                {review.date_review && (
                    <span>| {new Date(review.date_review).toLocaleDateString()}</span>
                )}
            </div>

            <div className="flex items-center mb-4">
                <strong className="mr-2 text-gray-700">Overall Rating:</strong> <StarRating rating={review.overall_rating} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                {review.work_life_balance !== null && <p><strong>Work-Life Balance:</strong> {review.work_life_balance}/5</p>}
                {review.culture_values !== null && <p><strong>Culture & Values:</strong> {review.culture_values}/5</p>}
                {review.career_opp !== null && <p><strong>Career Opp:</strong> {review.career_opp}/5</p>}
                {review.comp_benefits !== null && <p><strong>Comp & Benefits:</strong> {review.comp_benefits}/5</p>}
                {review.senior_mgmt !== null && <p><strong>Senior Mgmt:</strong> {review.senior_mgmt}/5</p>}
                {review.diversity_inclusion !== null && <p><strong>Diversity & Inclusion:</strong> {review.diversity_inclusion}/5</p>}
            </div>

            <div className="mb-4">
                {review.pros && (
                    <div className="mb-2">
                        <h4 className="font-semibold text-green-700 mb-1">Pros:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{review.pros}</p>
                    </div>
                )}
                {review.cons && (
                    <div>
                        <h4 className="font-semibold text-red-700 mb-1">Cons:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{review.cons}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-x-4 text-sm font-medium text-gray-600">
                {review.recommend && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{getRecommendationText(review.recommend)}</span>}
                {review.ceo_approv && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">{getApprovalText(review.ceo_approv)}</span>}
                {review.outlook && <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{getOutlookText(review.outlook)}</span>}
            </div>
        </div>
    );
}

interface CompanyDetailsClientComponentProps {
    initialData: CompanyDetailData | null;
    initialError: string | null;
    firmName: string;
}

export function CompanyDetailsClientComponent({ initialData, initialError, firmName }: CompanyDetailsClientComponentProps) {
    const [companyDetails, setCompanyDetails] = useState<CompanyDetailData | null>(initialData);
    const [currentPage, setCurrentPage] = useState<number>(initialData?.pagination?.currentPage || 1);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
    const [currentError, setCurrentError] = useState<string | null>(initialError);

    // Initialize hasMoreReviews based on initial data
    useEffect(() => {
        if (initialData?.pagination) {
            setHasMoreReviews(initialData.pagination.currentPage < initialData.pagination.totalPages);
        } else if (!initialData && !initialError) {
            setCurrentError("No data loaded for this company.");
        }
    }, [initialData, initialError]);


    if (currentError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-red-600 text-xl">
                <p>Error: {currentError}</p>
                <Link href="/company" className="mt-4 text-blue-600 hover:underline">
                    Go back to companies list
                </Link>
            </div>
        );
    }
    if (!companyDetails) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">Loading company details...</div>;
    }

    const { statistics, reviews, pagination } = companyDetails;

    const loadMoreReviews = async () => {
        if (loadingMore || !hasMoreReviews) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        try {
            const res = await fetch(`http://localhost:5000/review/review-by-firm/?firmName=${firmName}&page=${nextPage}&limit=${pagination.limit}`);
            if (!res.ok) {
                throw new Error(`Error loading more reviews: ${res.status} ${res.statusText}`);
            }
            const newReviewsData: CompanyDetailData = await res.json();
            setCompanyDetails(prevDetails => ({
                ...prevDetails!, // Use non-null assertion as we've checked for companyDetails
                reviews: [...prevDetails!.reviews, ...newReviewsData.reviews], // Append new reviews
                pagination: newReviewsData.pagination, // Update pagination info
            }));
            setCurrentPage(nextPage);
            setHasMoreReviews(newReviewsData.pagination.currentPage < newReviewsData.pagination.totalPages);
        } catch (err: any) {
            console.error('Failed to load more reviews:', err.message);
            setCurrentError(`Failed to load more reviews: ${err.message}`);
        } finally {
            setLoadingMore(false);
        }
    };

    // Convert string counts from DB to numbers for display
    const recommendYes = parseInt(statistics.recommend_yes || '0');
    const recommendNo = parseInt(statistics.recommend_no || '0');
    const recommendMixed = parseInt(statistics.recommend_mixed || '0');
    const ceoApprovYes = parseInt(statistics.ceo_approv_yes || '0');
    const ceoApprovNo = parseInt(statistics.ceo_approv_no || '0');
    const ceoApprovMixed = parseInt(statistics.ceo_approv_mixed || '0');
    const outlookPositive = parseInt(statistics.outlook_positive || '0');
    const outlookNeutral = parseInt(statistics.outlook_neutral || '0');
    const outlookNegative = parseInt(statistics.outlook_negative || '0');
    const totalReviewsCount = parseInt(statistics.total_reviews_count || '0');


    return (
        <div className="min-h-screen bg-gray-100 p-8 lg:p-12">
            {/* Metadata for this page */}
            <title>{statistics.firm} Reviews - Graduate Guide</title>
            <meta name="description" content={`Detailed reviews and statistics for ${statistics.firm}.`} />
            

            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="p-8 pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{statistics.firm}</h1>
                    <div className="flex items-center mb-4">
                        <strong className="text-xl text-gray-700 mr-2">Overall Rating:</strong> <StarRating rating={statistics.avg_overall_rating} />
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 border-b border-gray-200">
                    <h2 className="col-span-full text-2xl font-bold text-gray-800 mb-4">Company Statistics</h2>
                    <StatItem label="Work-Life Balance" value={statistics.avg_work_life_balance} />
                    <StatItem label="Culture & Values" value={statistics.avg_culture_values} />
                    <StatItem label="Diversity & Inclusion" value={statistics.avg_diversity_inclusion} />
                    <StatItem label="Career Opportunities" value={statistics.avg_career_opp} />
                    <StatItem label="Compensation & Benefits" value={statistics.avg_comp_benefits} />
                    <StatItem label="Senior Management" value={statistics.avg_senior_mgmt} />

                    <div className="col-span-full mt-4 border-t pt-4 border-gray-100">
                        <p className="text-gray-700 mb-2">
                            <strong className="font-semibold">Recommendation Rate:</strong> {recommendYes} Yes, {recommendNo} No, {recommendMixed} Mixed
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong className="font-semibold">CEO Approval:</strong> {ceoApprovYes} Yes, {ceoApprovNo} No, {ceoApprovMixed} Mixed
                        </p>
                        <p className="text-gray-700 mb-2">
                            <strong className="font-semibold">Business Outlook:</strong> {outlookPositive} Positive, {outlookNeutral} Neutral, {outlookNegative} Negative
                        </p>
                        <p className="text-gray-700 text-lg font-semibold mt-4">Total Reviews: {totalReviewsCount}</p>
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee Reviews</h2>
                    <div>
                        {reviews.length === 0 && totalReviewsCount > 0 ? (
                            <p className="text-center text-gray-600">No reviews found for this company on this page.</p>
                        ) : reviews.length === 0 && totalReviewsCount === 0 ? (
                            <p className="text-center text-gray-600">No reviews available for this company.</p>
                        ) : (
                            reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        )}
                    </div>

                    {hasMoreReviews && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMoreReviews}
                                disabled={loadingMore}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? 'Loading More...' : `Load More Reviews (${reviews.length} / ${totalReviewsCount})`}
                            </button>
                        </div>
                    )}

                    {!hasMoreReviews && totalReviewsCount > 0 && (
                        <p className="text-center text-gray-600 mt-8">You've reached the end of the reviews.</p>
                    )}
                </div>
            </div>
        </div>
    );
}