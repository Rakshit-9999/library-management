// // Library Management System Scripts
// $(document).ready(function() {
//     // Load the API key directly
//     let apiKey = "AIzaSyAd651dbzUFiKB9tA_MlFqkuqAxyZVb3hg";
    
//     // Log that the API key has been loaded
//     console.log("API key loaded successfully");
    
//     // DOM Elements
//     const searchInput = $("#search-input");
//     const searchButton = $("#search-button");
//     const popularBooksContainer = $("#popular-books");
//     const newArrivalsContainer = $("#new-arrivals");
//     const bookModal = $("#book-modal");
//     const closeModal = $("#close-modal");
//     const notification = $("#notification");
//     const notificationMessage = $("#notification-message");
//     const tabs = $(".tab");
//     const tabContents = $(".tab-content");
//     const categories = $(".category");
    
//     // Application State
//     let currentCategory = "All Books";
//     let currentBooks = [];
//     let isLoading = false;
    
//     // Initialize the application
//     init();
    
//     function init() {
//         // Load initial books
//         loadPopularBooks();
//         loadNewArrivals();
        
//         // Setup event listeners
//         setupEventListeners();
        
//         // Add animation effects
//         addAnimationEffects();
//     }
    
//     function setupEventListeners() {
//         // Search functionality
//         searchButton.on("click", performSearch);
//         searchInput.on("keypress", function(e) {
//             if (e.which === 13) {
//                 performSearch();
//             }
//         });
        
//         // Book card click event
//         $(document).on("click", ".book-card", function() {
//             const bookId = $(this).data("id");
//             openBookDetails(bookId);
//         });
        
//         // Close modal
//         closeModal.on("click", function() {
//             bookModal.fadeOut(300);
//             $("body").css("overflow", "auto");
//         });
        
//         // Tab switching
//         tabs.on("click", function() {
//             const tabId = $(this).data("tab");
//             tabs.removeClass("active");
//             $(this).addClass("active");
//             tabContents.removeClass("active");
//             $(`#${tabId}-tab`).addClass("active");
//         });
        
//         // Category filtering
//         categories.on("click", function() {
//             categories.removeClass("active");
//             $(this).addClass("active");
//             currentCategory = $(this).text();
//             filterBooksByCategory(currentCategory);
//         });
        
//         // Book actions
//         $(document).on("click", ".book-action-btn", function(e) {
//             e.stopPropagation();
//             const actionType = $(this).data("action");
//             const bookId = $(this).closest(".book-card").data("id");
//             handleBookAction(actionType, bookId);
//         });
        
//         // Add book button
//         $(".btn-primary").on("click", function() {
//             if ($(this).find(".btn-icon").hasClass("fa-book-open")) {
//                 showNotification("Starting reader view...");
//             } else if ($(this).text().trim() === "Add Book") {
//                 showAddBookForm();
//             } else {
//                 const bookId = $(this).data("book-id");
//                 addBookToCollection(bookId);
//             }
//         });
        
//         // Featured actions
//         $(".featured-actions .btn-secondary").on("click", function() {
//             showNotification("Book added to your collection");
//         });
//     }
    
//     function performSearch() {
//         const query = searchInput.val().trim();
//         if (query) {
//             showLoading(popularBooksContainer);
//             searchGoogleBooks(query);
//         }
//     }
    
//     function searchGoogleBooks(query) {
//         if (!apiKey) {
//             console.error("API key not set.");
//             showNotification("API key not set.", "error");
//             hideLoading(popularBooksContainer);
//             return;
//         }
        
//         $.ajax({
//             url: `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=12`,
//             dataType: "json",
//             success: function(data) {
//                 processGoogleBooksResponse(data, popularBooksContainer);
//             },
//             error: function(error) {
//                 console.error("Error fetching books:", error);
//                 popularBooksContainer.html("<p>Error fetching books. Please try again later.</p>");
//                 hideLoading(popularBooksContainer);
//                 showNotification("Sorry, there was an error with the search.", "error");
//             }
//         });
//     }
    
//     function processGoogleBooksResponse(data, container) {
//         if (data && data.items && data.items.length > 0) {
//             const books = data.items.map(item => {
//                 const volumeInfo = item.volumeInfo;
//                 return {
//                     id: item.id,
//                     title: volumeInfo.title || "Unknown Title",
//                     author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author",
//                     cover: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : `https://placehold.co/400x600/e8e8e8/323232?text=${encodeURIComponent(volumeInfo.title || "Unknown")}`,
//                     rating: volumeInfo.averageRating || (Math.random() * 2 + 3).toFixed(1),
//                     category: volumeInfo.categories ? volumeInfo.categories[0] : "Fiction",
//                     description: volumeInfo.description || "No description available.",
//                     pageCount: volumeInfo.pageCount || "Unknown",
//                     publishedDate: volumeInfo.publishedDate || "Unknown"
//                 };
//             });
            
//             if (container === popularBooksContainer) {
//                 currentBooks = books;
//             } else {
//                 currentBooks = [...currentBooks, ...books];
//             }
            
//             displayBooks(container, books);
//         } else {
//             container.html("<p>No books found. Please try another search.</p>");
//         }
//         hideLoading(container);
//     }
    
//     function loadPopularBooks() {
//         showLoading(popularBooksContainer);
        
//         // Using Google Books API for popular books - filtering by popularity
//         $.ajax({
//             url: `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&key=${apiKey}&maxResults=8`,
//             dataType: "json",
//             success: function(data) {
//                 processGoogleBooksResponse(data, popularBooksContainer);
//             },
//             error: function(error) {
//                 console.error("Error fetching popular books:", error);
//                 popularBooksContainer.html("<p>Error fetching popular books. Please try again later.</p>");
//                 hideLoading(popularBooksContainer);
//                 showNotification("Sorry, there was an error loading popular books.", "error");
//             }
//         });
//     }
    
//     function loadNewArrivals() {
//         showLoading(newArrivalsContainer);
        
//         // Using Google Books API for new arrivals - filtering by newest
//         $.ajax({
//             url: `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&key=${apiKey}&maxResults=8`,
//             dataType: "json",
//             success: function(data) {
//                 processGoogleBooksResponse(data, newArrivalsContainer);
//             },
//             error: function(error) {
//                 console.error("Error fetching new arrivals:", error);
//                 newArrivalsContainer.html("<p>Error fetching new books. Please try again later.</p>");
//                 hideLoading(newArrivalsContainer);
//                 showNotification("Sorry, there was an error loading new arrivals.", "error");
//             }
//         });
//     }
    
//     function displayBooks(container, books) {
//         container.empty();
        
//         if (books.length === 0) {
//             container.html("<p>No books found in this category.</p>");
//             return;
//         }
        
//         books.forEach(book => {
//             const bookCard = `
//                 <div class="book-card" data-id="${book.id}" data-category="${book.category}">
//                     <div class="book-cover">
//                         <img src="${book.cover}" alt="${book.title} cover">
//                     </div>
//                     <div class="book-info">
//                         <h3 class="book-title">${book.title}</h3>
//                         <div class="book-author">by ${book.author}</div>
//                         <div class="book-actions">
//                             <div class="book-rating">
//                                 <i class="fas fa-star rating-star"></i>
//                                 <span class="rating-value">${book.rating}</span>
//                             </div>
//                             <div class="book-action-btn" data-action="favorite">
//                                 <i class="far fa-heart"></i>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             `;
//             container.append(bookCard);
//         });
        
//         // Animate the books appearance
//         animateBooks();
//     }
    
//     function openBookDetails(bookId) {
//         const book = currentBooks.find(b => b.id === bookId);
        
//         if (!book) return;
        
//         const bookDetailsHTML = `
//             <div class="book-details-cover">
//                 <img src="${book.cover}" alt="${book.title} cover">
//             </div>
//             <div class="book-details-info">
//                 <h2>${book.title}</h2>
//                 <div class="book-details-author">by ${book.author}</div>
//                 <div class="book-details-meta">
//                     <div class="meta-item">
//                         <span class="meta-label">Rating</span>
//                         <span class="meta-value">
//                             <i class="fas fa-star" style="color: gold;"></i>
//                             ${book.rating}/5.0
//                         </span>
//                     </div>
//                     <div class="meta-item">
//                         <span class="meta-label">Genre</span>
//                         <span class="meta-value">${book.category}</span>
//                     </div>
//                     <div class="meta-item">
//                         <span class="meta-label">Pages</span>
//                         <span class="meta-value">${book.pageCount || "Unknown"}</span>
//                     </div>
//                 </div>
//                 <div class="book-details-actions">
//                     <button class="btn btn-primary" data-book-id="${book.id}">
//                         <i class="fas fa-book-open btn-icon"></i>
//                         Read Now
//                     </button>
//                     <button class="btn btn-secondary">
//                         <i class="fas fa-bookmark btn-icon"></i>
//                         Add to Collection
//                     </button>
//                 </div>
//             </div>
//         `;
        
//         $("#book-details-content").html(bookDetailsHTML);
//         $("#description-tab").html(`<p class="book-details-description">${book.description || "No description available."}</p>`);
        
//         // Reset tabs
//         tabs.removeClass("active");
//         tabs.first().addClass("active");
//         tabContents.removeClass("active");
//         tabContents.first().addClass("active");
        
//         // Show modal
//         bookModal.fadeIn(300);
//         $("body").css("overflow", "hidden");
//     }
    
//     function filterBooksByCategory(category) {
//         if (category === "All Books") {
//             displayBooks(popularBooksContainer, currentBooks.slice(0, Math.min(8, currentBooks.length)));
//             return;
//         }
        
//         const filteredBooks = currentBooks.filter(book => book.category === category);
//         displayBooks(popularBooksContainer, filteredBooks);
//     }
    
//     function handleBookAction(action, bookId) {
//         switch (action) {
//             case "favorite":
//                 toggleFavorite(bookId);
//                 break;
//             // Add more actions as needed
//         }
//     }
    
//     function toggleFavorite(bookId) {
//         const heartIcon = $(`.book-card[data-id="${bookId}"] .book-action-btn[data-action="favorite"] i`);
        
//         if (heartIcon.hasClass("far")) {
//             heartIcon.removeClass("far").addClass("fas").css("color", "#ff3a3a");
//             showNotification("Added to favorites");
//         } else {
//             heartIcon.removeClass("fas").addClass("far").css("color", "");
//             showNotification("Removed from favorites");
//         }
//     }
    
//     function addBookToCollection(bookId) {
//         showNotification("Book added to your collection");
//     }
    
//     function showAddBookForm() {
//         // In a real app, this would open a form to add a new book
//         // For demo purposes, we'll just show a notification
//         showNotification("Add book feature coming soon!");
//     }
    
//     function showNotification(message, type = "success") {
//         notificationMessage.text(message);
        
//         if (type === "error") {
//             notification.css("background-color", "#ff3a3a");
//             $("#notification .notification-icon").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
//         } else {
//             notification.css("background-color", "");
//             $("#notification .notification-icon").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
//         }
        
//         notification.addClass("show");
        
//         setTimeout(() => {
//             notification.removeClass("show");
//         }, 3000);
//     }
    
//     function showLoading(container) {
//         container.html(`
//             <div class="loading" style="display: block;">
//                 <div class="spinner"></div>
//                 <p>Loading books...</p>
//             </div>
//         `);
//         isLoading = true;
//     }
    
//     function hideLoading(container) {
//         container.find(".loading").fadeOut();
//         isLoading = false;
//     }
    
//     function addAnimationEffects() {
//         // Add hover effects on book cards
//         $(document).on("mouseenter", ".book-card", function() {
//             $(this).find("img").css("transform", "scale(1.05)");
//         }).on("mouseleave", ".book-card", function() {
//             $(this).find("img").css("transform", "");
//         });
        
//         // Smooth scroll for category clicks
//         categories.on("click", function() {
//             $('html, body').animate({
//                 scrollTop: popularBooksContainer.offset().top - 100
//             }, 500);
//         });
//     }
    
//     function animateBooks() {
//         $(".book-card").each(function(index) {
//             $(this).css({
//                 "opacity": 0,
//                 "transform": "translateY(20px)"
//             }).delay(index * 100).animate({
//                 "opacity": 1,
//                 "transform": "translateY(0px)"
//             }, 500);
//         });
//     }
// });

// Library Management System Scripts
$(document).ready(function() {
    // Load the API key directly
    let apiKey = "AIzaSyAd651dbzUFiKB9tA_MlFqkuqAxyZVb3hg";
    
    // Log that the API key has been loaded
    console.log("API key loaded successfully");
    
    // DOM Elements
    const searchInput = $("#search-input");
    const searchButton = $("#search-button");
    const popularBooksContainer = $("#popular-books");
    const newArrivalsContainer = $("#new-arrivals");
    const featuredBooksContainer = $("#featured-books"); // Add this selector for featured books section
    const bookModal = $("#book-modal");
    const closeModal = $("#close-modal");
    const notification = $("#notification");
    const notificationMessage = $("#notification-message");
    const tabs = $(".tab");
    const tabContents = $(".tab-content");
    const categories = $(".category");
    
    // Application State
    let currentCategory = "All Books";
    let currentBooks = [];
    let featuredBooks = []; // To store featured books
    let isLoading = false;
    
    // Initialize the application
    init();
    
    function init() {
        // Load initial books
        loadPopularBooks();
        loadNewArrivals();
        loadFeaturedBooks(); // Add this function call to load featured books
        
        // Setup event listeners
        setupEventListeners();
        
        // Add animation effects
        addAnimationEffects();
    }
    
    function setupEventListeners() {
        // Search functionality
        searchButton.on("click", performSearch);
        searchInput.on("keypress", function(e) {
            if (e.which === 13) {
                performSearch();
            }
        });
        
        // Book card click event
        $(document).on("click", ".book-card", function() {
            const bookId = $(this).data("id");
            openBookDetails(bookId);
        });
        
        // Featured book click event
        $(document).on("click", ".featured-book", function() {
            const bookId = $(this).data("id");
            const book = featuredBooks.find(b => b.id === bookId);
            if (book) {
                openBookDetails(bookId);
            }
        });
        
        // Close modal
        closeModal.on("click", function() {
            bookModal.fadeOut(300);
            $("body").css("overflow", "auto");
        });
        
        // Tab switching
        tabs.on("click", function() {
            const tabId = $(this).data("tab");
            tabs.removeClass("active");
            $(this).addClass("active");
            tabContents.removeClass("active");
            $(`#${tabId}-tab`).addClass("active");
        });
        
        // Category filtering
        categories.on("click", function() {
            categories.removeClass("active");
            $(this).addClass("active");
            currentCategory = $(this).text();
            filterBooksByCategory(currentCategory);
        });
        
        // Book actions
        $(document).on("click", ".book-action-btn", function(e) {
            e.stopPropagation();
            const actionType = $(this).data("action");
            const bookId = $(this).closest(".book-card").data("id");
            handleBookAction(actionType, bookId);
        });
        
        // Add book button
        $(".btn-primary").on("click", function() {
            if ($(this).find(".btn-icon").hasClass("fa-book-open")) {
                showNotification("Starting reader view...");
            } else if ($(this).text().trim() === "Add Book") {
                showAddBookForm();
            } else {
                const bookId = $(this).data("book-id");
                addBookToCollection(bookId);
            }
        });
        
        // Featured actions
        $(document).on("click", ".featured-actions .btn-secondary", function() {
            const bookId = $(this).closest(".featured-book").data("id");
            addBookToCollection(bookId);
            showNotification("Book added to your collection");
        });
    }
    
    function performSearch() {
        const query = searchInput.val().trim();
        if (query) {
            showLoading(popularBooksContainer);
            searchGoogleBooks(query);
        }
    }
    
    function searchGoogleBooks(query) {
        if (!apiKey) {
            console.error("API key not set.");
            showNotification("API key not set.", "error");
            hideLoading(popularBooksContainer);
            return;
        }
        
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=12`,
            dataType: "json",
            success: function(data) {
                processGoogleBooksResponse(data, popularBooksContainer);
            },
            error: function(error) {
                console.error("Error fetching books:", error);
                popularBooksContainer.html("<p>Error fetching books. Please try again later.</p>");
                hideLoading(popularBooksContainer);
                showNotification("Sorry, there was an error with the search.", "error");
            }
        });
    }
    
    function processGoogleBooksResponse(data, container) {
        if (data && data.items && data.items.length > 0) {
            const books = data.items.map(item => {
                const volumeInfo = item.volumeInfo;
                return {
                    id: item.id,
                    title: volumeInfo.title || "Unknown Title",
                    author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author",
                    cover: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : `https://placehold.co/400x600/e8e8e8/323232?text=${encodeURIComponent(volumeInfo.title || "Unknown")}`,
                    rating: volumeInfo.averageRating || (Math.random() * 2 + 3).toFixed(1),
                    category: volumeInfo.categories ? volumeInfo.categories[0] : "Fiction",
                    description: volumeInfo.description || "No description available.",
                    pageCount: volumeInfo.pageCount || "Unknown",
                    publishedDate: volumeInfo.publishedDate || "Unknown"
                };
            });
            
            if (container === popularBooksContainer) {
                currentBooks = books;
            } else if (container === featuredBooksContainer) {
                featuredBooks = books;
            } else {
                currentBooks = [...currentBooks, ...books];
            }
            
            if (container === featuredBooksContainer) {
                displayFeaturedBooks(container, books);
            } else {
                displayBooks(container, books);
            }
        } else {
            container.html("<p>No books found. Please try another search.</p>");
        }
        hideLoading(container);
    }
    
    // New function to load featured books specifically
    function loadFeaturedBooks() {
        showLoading(featuredBooksContainer);
        
        // Using Google Books API for featured books - querying for bestsellers or popular books
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=subject:bestseller&orderBy=relevance&key=${apiKey}&maxResults=4`,
            dataType: "json",
            success: function(data) {
                processGoogleBooksResponse(data, featuredBooksContainer);
            },
            error: function(error) {
                console.error("Error fetching featured books:", error);
                featuredBooksContainer.html("<p>Error fetching featured books. Please try again later.</p>");
                hideLoading(featuredBooksContainer);
                showNotification("Sorry, there was an error loading featured books.", "error");
            }
        });
    }
    
    // New function to display featured books in a special format
    function displayFeaturedBooks(container, books) {
        container.empty();
        
        if (books.length === 0) {
            container.html("<p>No featured books found.</p>");
            return;
        }
        
        // Take the first book as the main featured book
        const mainBook = books[0];
        const otherBooks = books.slice(1, 4); // Take up to 3 more books
        
        // Create main featured book element
        const mainFeaturedHTML = `
            <div class="featured-book main-featured" data-id="${mainBook.id}">
                <div class="featured-cover">
                    <img src="${mainBook.cover}" alt="${mainBook.title} cover">
                </div>
                <div class="featured-info">
                    <h2>${mainBook.title}</h2>
                    <div class="featured-author">by ${mainBook.author}</div>
                    <div class="featured-rating">
                        <i class="fas fa-star rating-star"></i>
                        <span class="rating-value">${mainBook.rating}</span>
                    </div>
                    <p class="featured-description">${mainBook.description ? mainBook.description.substring(0, 200) + '...' : 'No description available.'}</p>
                    <div class="featured-actions">
                        <button class="btn btn-primary" data-book-id="${mainBook.id}">
                            <i class="fas fa-book-open btn-icon"></i>
                            Read Now
                        </button>
                        <button class="btn btn-secondary">
                            <i class="fas fa-bookmark btn-icon"></i>
                            Add to Collection
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.append(mainFeaturedHTML);
        
        // Create secondary featured books section if we have more books
        if (otherBooks.length > 0) {
            const secondaryFeaturedContainer = $('<div class="secondary-featured"></div>');
            
            otherBooks.forEach(book => {
                const secondaryBookHTML = `
                    <div class="featured-book secondary-book" data-id="${book.id}">
                        <div class="featured-cover">
                            <img src="${book.cover}" alt="${book.title} cover">
                        </div>
                        <div class="featured-info">
                            <h3>${book.title}</h3>
                            <div class="featured-author">by ${book.author}</div>
                            <div class="featured-actions">
                                <button class="btn btn-secondary btn-sm">
                                    <i class="fas fa-bookmark btn-icon"></i>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                secondaryFeaturedContainer.append(secondaryBookHTML);
            });
            
            container.append(secondaryFeaturedContainer);
        }
        
        // Add the featured books to the currentBooks array as well to enable modal opening
        if (!currentBooks.some(b => b.id === mainBook.id)) {
            currentBooks = [...currentBooks, mainBook, ...otherBooks];
        }
        
        // Animate the featured books appearance
        animateFeaturedBooks();
    }
    
    function loadPopularBooks() {
        showLoading(popularBooksContainer);
        
        // Using Google Books API for popular books - filtering by popularity
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&key=${apiKey}&maxResults=8`,
            dataType: "json",
            success: function(data) {
                processGoogleBooksResponse(data, popularBooksContainer);
            },
            error: function(error) {
                console.error("Error fetching popular books:", error);
                popularBooksContainer.html("<p>Error fetching popular books. Please try again later.</p>");
                hideLoading(popularBooksContainer);
                showNotification("Sorry, there was an error loading popular books.", "error");
            }
        });
    }
    
    function loadNewArrivals() {
        showLoading(newArrivalsContainer);
        
        // Using Google Books API for new arrivals - filtering by newest
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&key=${apiKey}&maxResults=8`,
            dataType: "json",
            success: function(data) {
                processGoogleBooksResponse(data, newArrivalsContainer);
            },
            error: function(error) {
                console.error("Error fetching new arrivals:", error);
                newArrivalsContainer.html("<p>Error fetching new books. Please try again later.</p>");
                hideLoading(newArrivalsContainer);
                showNotification("Sorry, there was an error loading new arrivals.", "error");
            }
        });
    }
    
    function displayBooks(container, books) {
        container.empty();
        
        if (books.length === 0) {
            container.html("<p>No books found in this category.</p>");
            return;
        }
        
        books.forEach(book => {
            const bookCard = `
                <div class="book-card" data-id="${book.id}" data-category="${book.category}">
                    <div class="book-cover">
                        <img src="${book.cover}" alt="${book.title} cover">
                    </div>
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <div class="book-author">by ${book.author}</div>
                        <div class="book-actions">
                            <div class="book-rating">
                                <i class="fas fa-star rating-star"></i>
                                <span class="rating-value">${book.rating}</span>
                            </div>
                            <div class="book-action-btn" data-action="favorite">
                                <i class="far fa-heart"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(bookCard);
        });
        
        // Animate the books appearance
        animateBooks();
    }
    
    function openBookDetails(bookId) {
        // Check in both currentBooks and featuredBooks arrays
        const book = [...currentBooks, ...featuredBooks].find(b => b.id === bookId);
        
        if (!book) return;
        
        const bookDetailsHTML = `
            <div class="book-details-cover">
                <img src="${book.cover}" alt="${book.title} cover">
            </div>
            <div class="book-details-info">
                <h2>${book.title}</h2>
                <div class="book-details-author">by ${book.author}</div>
                <div class="book-details-meta">
                    <div class="meta-item">
                        <span class="meta-label">Rating</span>
                        <span class="meta-value">
                            <i class="fas fa-star" style="color: gold;"></i>
                            ${book.rating}/5.0
                        </span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Genre</span>
                        <span class="meta-value">${book.category}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Pages</span>
                        <span class="meta-value">${book.pageCount || "Unknown"}</span>
                    </div>
                </div>
                <div class="book-details-actions">
                    <button class="btn btn-primary" data-book-id="${book.id}">
                        <i class="fas fa-book-open btn-icon"></i>
                        Read Now
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fas fa-bookmark btn-icon"></i>
                        Add to Collection
                    </button>
                </div>
            </div>
        `;
        
        $("#book-details-content").html(bookDetailsHTML);
        $("#description-tab").html(`<p class="book-details-description">${book.description || "No description available."}</p>`);
        
        // Reset tabs
        tabs.removeClass("active");
        tabs.first().addClass("active");
        tabContents.removeClass("active");
        tabContents.first().addClass("active");
        
        // Show modal
        bookModal.fadeIn(300);
        $("body").css("overflow", "hidden");
    }
    
    function filterBooksByCategory(category) {
        if (category === "All Books") {
            displayBooks(popularBooksContainer, currentBooks.slice(0, Math.min(8, currentBooks.length)));
            return;
        }
        
        const filteredBooks = currentBooks.filter(book => book.category === category);
        displayBooks(popularBooksContainer, filteredBooks);
    }
    
    function handleBookAction(action, bookId) {
        switch (action) {
            case "favorite":
                toggleFavorite(bookId);
                break;
            // Add more actions as needed
        }
    }
    
    function toggleFavorite(bookId) {
        const heartIcon = $(`.book-card[data-id="${bookId}"] .book-action-btn[data-action="favorite"] i`);
        
        if (heartIcon.hasClass("far")) {
            heartIcon.removeClass("far").addClass("fas").css("color", "#ff3a3a");
            showNotification("Added to favorites");
        } else {
            heartIcon.removeClass("fas").addClass("far").css("color", "");
            showNotification("Removed from favorites");
        }
    }
    
    function addBookToCollection(bookId) {
        showNotification("Book added to your collection");
    }
    
    function showAddBookForm() {
        // In a real app, this would open a form to add a new book
        // For demo purposes, we'll just show a notification
        showNotification("Add book feature coming soon!");
    }
    
    function showNotification(message, type = "success") {
        notificationMessage.text(message);
        
        if (type === "error") {
            notification.css("background-color", "#ff3a3a");
            $("#notification .notification-icon").removeClass("fa-check-circle").addClass("fa-exclamation-circle");
        } else {
            notification.css("background-color", "");
            $("#notification .notification-icon").removeClass("fa-exclamation-circle").addClass("fa-check-circle");
        }
        
        notification.addClass("show");
        
        setTimeout(() => {
            notification.removeClass("show");
        }, 3000);
    }
    
    function showLoading(container) {
        container.html(`
            <div class="loading" style="display: block;">
                <div class="spinner"></div>
                <p>Loading books...</p>
            </div>
        `);
        isLoading = true;
    }
    
    function hideLoading(container) {
        container.find(".loading").fadeOut();
        isLoading = false;
    }
    
    function addAnimationEffects() {
        // Add hover effects on book cards
        $(document).on("mouseenter", ".book-card, .featured-book", function() {
            $(this).find("img").css("transform", "scale(1.05)");
        }).on("mouseleave", ".book-card, .featured-book", function() {
            $(this).find("img").css("transform", "");
        });
        
        // Smooth scroll for category clicks
        categories.on("click", function() {
            $('html, body').animate({
                scrollTop: popularBooksContainer.offset().top - 100
            }, 500);
        });
    }
    
    function animateBooks() {
        $(".book-card").each(function(index) {
            $(this).css({
                "opacity": 0,
                "transform": "translateY(20px)"
            }).delay(index * 100).animate({
                "opacity": 1,
                "transform": "translateY(0px)"
            }, 500);
        });
    }
    
    // New function to animate featured books
    function animateFeaturedBooks() {
        // Animate main featured book
        $(".main-featured").css({
            "opacity": 0,
            "transform": "translateY(20px)"
        }).delay(100).animate({
            "opacity": 1,
            "transform": "translateY(0px)"
        }, 500);
        
        // Animate secondary featured books
        $(".secondary-book").each(function(index) {
            $(this).css({
                "opacity": 0,
                "transform": "translateY(20px)"
            }).delay((index + 2) * 100).animate({
                "opacity": 1,
                "transform": "translateY(0px)"
            }, 500);
        });
    }
});