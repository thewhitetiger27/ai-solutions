
'use server';

import { db } from './firebase';
import { collection, getDocs, writeBatch, doc, addDoc, updateDoc, deleteDoc, query, where, Timestamp, orderBy, setDoc, getCountFromServer } from 'firebase/firestore';
import { services as mockServices, testimonials as mockTestimonials, featuredProjects as mockProjects, articles as mockArticles, galleryImages as mockGalleryImages, events as mockEvents, contactSubmissions as mockContactSubmissions, quoteRequests as mockQuoteRequests } from './mock-data';
import type { Service, Project, Article, Feedback, GalleryImage, Event, ContactSubmission, QuoteRequest } from './mock-data';
import { revalidatePath } from 'next/cache';

// Services
export async function getServices(): Promise<Service[]> {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'services'), orderBy('id')));
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
        console.error("Error fetching services:", error);
        throw new Error("Could not fetch services from Firestore.");
    }
}

export async function getFeaturedServices(): Promise<Service[]> {
    try {
        const q = query(collection(db, "services"), where("featured", "==", true));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
    } catch (error) {
        console.error("Error fetching featured services:", error);
        throw new Error("Could not fetch featured services from Firestore.");
    }
}

export async function addService(service: Omit<Service, 'id'>) {
    try {
        const snapshot = await getCountFromServer(collection(db, 'services'));
        const newId = (snapshot.data().count + 1).toString();
        const newDocRef = doc(db, 'services', newId);
        const newService = { ...service, id: newId };
        await setDoc(newDocRef, newService);
        revalidatePath('/admin/services');
        revalidatePath('/');
        revalidatePath('/services');
        return { success: true, id: newId };
    } catch (error) {
        console.error("Error adding service: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add service. ${errorMessage}` };
    }
}

export async function updateService(id: string, service: Partial<Service>) {
    try {
        const serviceRef = doc(db, 'services', id);
        await updateDoc(serviceRef, service);
        revalidatePath('/admin/services');
        revalidatePath('/');
        revalidatePath('/services');
        revalidatePath(`/services/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating service: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update service. ${errorMessage}` };
    }
}

export async function deleteService(id: string) {
    try {
        await deleteDoc(doc(db, 'services', id));
        revalidatePath('/admin/services');
        revalidatePath('/');
        revalidatePath('/services');
        return { success: true };
    } catch (error) {
        console.error("Error deleting service: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete service. ${errorMessage}` };
    }
}

// Articles
export async function getArticles(): Promise<Article[]> {
     try {
        const querySnapshot = await getDocs(query(collection(db, 'articles'), orderBy('id')));
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw new Error("Could not fetch articles from Firestore.");
    }
}

export async function getFeaturedArticles(): Promise<Article[]> {
    try {
        const q = query(collection(db, "articles"), where("featured", "==", true));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return [];
        const articles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        // Sort by date in the application code
        return articles.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
    } catch (error) {
        console.error("Error fetching featured articles:", error);
        throw new Error("Could not fetch featured articles from Firestore.");
    }
}


export async function addArticle(article: Omit<Article, 'id'>) {
    try {
        const snapshot = await getCountFromServer(collection(db, 'articles'));
        const newId = (snapshot.data().count + 1).toString();
        const newDocRef = doc(db, 'articles', newId);
        const newArticle = { ...article, id: newId };
        await setDoc(newDocRef, newArticle);
        revalidatePath('/admin/articles');
        revalidatePath('/blog');
        revalidatePath('/');
        return { success: true, id: newId };
    } catch (error) {
        console.error("Error adding article: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add article. ${errorMessage}` };
    }
}

export async function updateArticle(id: string, article: Partial<Article>) {
    try {
        const articleRef = doc(db, 'articles', id);
        await updateDoc(articleRef, article);
        revalidatePath('/admin/articles');
        revalidatePath('/blog');
        revalidatePath('/');
        revalidatePath(`/blog/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating article: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update article. ${errorMessage}` };
    }
}

export async function deleteArticle(id: string) {
    try {
        await deleteDoc(doc(db, 'articles', id));
        revalidatePath('/admin/articles');
        revalidatePath('/blog');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error deleting article: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete article. ${errorMessage}` };
    }
}

// Events
export async function getEvents(): Promise<Event[]> {
     try {
        const querySnapshot = await getDocs(query(collection(db, 'events'), orderBy('id')));
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Could not fetch events from Firestore.");
    }
}

export async function addEvent(event: Omit<Event, 'id'>) {
    try {
        const snapshot = await getCountFromServer(collection(db, 'events'));
        const newId = (snapshot.data().count + 1).toString();
        const newDocRef = doc(db, 'events', newId);
        const newEvent = { ...event, id: newId };
        await setDoc(newDocRef, newEvent);
        revalidatePath('/admin/events');
        revalidatePath('/events');
        return { success: true, id: newId };
    } catch (error) {
        console.error("Error adding event: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add event. ${errorMessage}` };
    }
}

export async function updateEvent(id: string, event: Partial<Event>) {
    try {
        const eventRef = doc(db, 'events', id);
        await updateDoc(eventRef, event);
        revalidatePath('/admin/events');
        revalidatePath('/events');
        revalidatePath(`/events/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating event: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update event. ${errorMessage}` };
    }
}

export async function deleteEvent(id: string) {
    try {
        await deleteDoc(doc(db, 'events', id));
        revalidatePath('/admin/events');
        revalidatePath('/events');
        return { success: true };
    } catch (error) {
        console.error("Error deleting event: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete event. ${errorMessage}` };
    }
}

// Gallery Images
export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'galleryImages'), orderBy('id')));
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        throw new Error("Could not fetch gallery images from Firestore.");
    }
}

export async function addGalleryImage(image: Omit<GalleryImage, 'id'>) {
    try {
        const newDocRef = await addDoc(collection(db, 'galleryImages'), image);
        // update the document to include its own ID, for consistency.
        await updateDoc(newDocRef, { id: newDocRef.id });
        revalidatePath('/admin/gallery');
        revalidatePath('/gallery');
        return { success: true, id: newDocRef.id };
    } catch (error) {
        console.error("Error adding gallery image: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add gallery image. ${errorMessage}` };
    }
}

export async function updateGalleryImage(id: string, image: Partial<GalleryImage>) {
    try {
        const imageRef = doc(db, 'galleryImages', id);
        await updateDoc(imageRef, image);
        revalidatePath('/admin/gallery');
        revalidatePath('/gallery');
        return { success: true };
    } catch (error) {
        console.error("Error updating gallery image: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update image. ${errorMessage}` };
    }
}

export async function deleteGalleryImage(id: string) {
    try {
        await deleteDoc(doc(db, 'galleryImages', id));
        revalidatePath('/admin/gallery');
        revalidatePath('/gallery');
        return { success: true };
    } catch (error) {
        console.error("Error deleting gallery image: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete gallery image. ${errorMessage}` };
    }
}


// Projects
export async function getProjects(): Promise<Project[]> {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'featuredProjects'), orderBy('id')));
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()} as Project));
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Could not fetch projects from Firestore.");
    }
}

export async function addProject(project: Omit<Project, 'id'>) {
    try {
        const snapshot = await getCountFromServer(collection(db, 'featuredProjects'));
        const newId = (snapshot.data().count + 1).toString();
        const newDocRef = doc(db, 'featuredProjects', newId);
        const newProject = { ...project, id: newId };
        await setDoc(newDocRef, newProject);
        revalidatePath('/admin/projects');
        revalidatePath('/');
        revalidatePath('/projects');
        return { success: true, id: newId };
    } catch (error) {
        console.error("Error adding project: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add project. ${errorMessage}` };
    }
}

export async function updateProject(id: string, project: Partial<Project>) {
    try {
        const projectRef = doc(db, 'featuredProjects', id);
        await updateDoc(projectRef, project);
        revalidatePath('/admin/projects');
        revalidatePath('/');
        revalidatePath('/projects');
        return { success: true };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update project. ${errorMessage}` };
    }
}

export async function deleteProject(id: string) {
    try {
        await deleteDoc(doc(db, 'featuredProjects', id));
        revalidatePath('/admin/projects');
        revalidatePath('/');
        revalidatePath('/projects');
        return { success: true };
    } catch (error) {
        console.error("Error deleting project: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete project. ${errorMessage}` };
    }
}


// Testimonials
export async function getTestimonials(): Promise<Feedback[]> {
    try {
        const querySnapshot = await getDocs(query(collection(db, 'testimonials'), orderBy('id')));
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()} as Feedback));
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        throw new Error("Could not fetch testimonials from Firestore.");
    }
}

export async function getApprovedTestimonials(): Promise<Feedback[]> {
    try {
        const q = query(collection(db, "testimonials"), where("status", "==", "approved"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()} as Feedback));
    } catch (error) {
        console.error("Error fetching approved testimonials:", error);
        throw new Error("Could not fetch approved testimonials from Firestore.");
    }
}

export async function getFeaturedTestimonials(): Promise<Feedback[]> {
    try {
        const q = query(collection(db, "testimonials"), where("status", "==", "approved"), where("featured", "==", true));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return [];
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()} as Feedback));
    } catch (error) {
        console.error("Error fetching featured testimonials:", error);
        throw new Error("Could not fetch featured testimonials from Firestore.");
    }
}

export async function addTestimonial(testimonial: Omit<Feedback, 'id' | 'status'>) {
    try {
        const snapshot = await getCountFromServer(collection(db, 'testimonials'));
        const newId = (snapshot.data().count + 1).toString();
        const newDocRef = doc(db, 'testimonials', newId);
        const newTestimonial = { ...testimonial, id: newId, status: 'pending', featured: false };
        await setDoc(newDocRef, newTestimonial);
        revalidatePath('/admin/feedback');
        revalidatePath('/feedback');
        return { success: true, id: newId };
    } catch (error) {
        console.error("Error adding testimonial: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to add testimonial. ${errorMessage}` };
    }
}

export async function updateTestimonialStatus(id: string, status: 'approved' | 'rejected') {
    try {
        const testimonialRef = doc(db, 'testimonials', id);
        await updateDoc(testimonialRef, { status });
        revalidatePath('/admin/feedback');
        revalidatePath('/feedback');
        revalidatePath('/'); // Revalidate home page in case testimonials are shown there
        return { success: true };
    } catch (error) {
        console.error("Error updating testimonial status: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update status. ${errorMessage}` };
    }
}

export async function updateTestimonialFeaturedStatus(id: string, featured: boolean) {
    try {
        const testimonialRef = doc(db, 'testimonials', id);
        await updateDoc(testimonialRef, { featured });
        revalidatePath('/admin/feedback');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error updating testimonial featured status: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update featured status. ${errorMessage}` };
    }
}


export async function deleteTestimonial(id: string) {
    try {
        await deleteDoc(doc(db, 'testimonials', id));
        revalidatePath('/admin/feedback');
        revalidatePath('/feedback');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error deleting testimonial: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete testimonial. ${errorMessage}` };
    }
}


// Contact Submissions
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    try {
        const q = query(collection(db, 'contactSubmissions'), orderBy('created_at', 'desc'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return [];
        const submissions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                created_at: (data.created_at as Timestamp).toDate()
            } as ContactSubmission;
        });
        return submissions;
    } catch (error) {
        console.error("Error fetching contact submissions:", error);
        throw new Error("Could not fetch contact submissions from Firestore.");
    }
}

export async function addContactSubmission(submission: Omit<ContactSubmission, 'id' | 'created_at' | 'read_status'>) {
    try {
        const snapshot = await getCountFromServer(collection(db, 'contactSubmissions'));
        const newId = (snapshot.data().count + 1).toString();
        const newDocRef = doc(db, 'contactSubmissions', newId);
        await setDoc(newDocRef, {
            ...submission,
            id: newId,
            created_at: new Date(),
            read_status: false
        });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error("Error adding contact submission: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to submit inquiry. ${errorMessage}` };
    }
}

export async function updateContactSubmissionStatus(id: string, read_status: boolean) {
    try {
        const submissionRef = doc(db, 'contactSubmissions', id);
        await updateDoc(submissionRef, { read_status });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error("Error updating submission status: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update status. ${errorMessage}` };
    }
}

export async function deleteContactSubmission(id: string) {
    try {
        await deleteDoc(doc(db, 'contactSubmissions', id));
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error("Error deleting inquiry: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete inquiry. ${errorMessage}` };
    }
}


// Quote Requests
export async function getQuoteRequests(): Promise<QuoteRequest[]> {
    try {
        const q = query(collection(db, 'quoteRequests'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return [];
        const requests = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                createdAt: (data.createdAt as Timestamp).toDate()
            } as QuoteRequest;
        });
        return requests;
    } catch (error) {
        console.error("Error fetching quote requests:", error);
        throw new Error("Could not fetch quote requests from Firestore.");
    }
}

export async function addQuoteRequest(quoteData: Omit<QuoteRequest, 'id' | 'createdAt' | 'status'>) {
     try {
        const newDocRef = await addDoc(collection(db, 'quoteRequests'), {
            ...quoteData,
            createdAt: new Date(),
            status: 'new'
        });
        await updateDoc(newDocRef, { id: newDocRef.id });
        revalidatePath('/admin/quotes');
        return { success: true };
    } catch (error) {
        console.error("Error adding quote request: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to submit quote request. ${errorMessage}` };
    }
}

export async function updateQuoteRequestStatus(id: string, status: QuoteRequest['status']) {
    try {
        const quoteRef = doc(db, 'quoteRequests', id);
        await updateDoc(quoteRef, { status });
        revalidatePath('/admin/quotes');
        return { success: true };
    } catch (error) {
        console.error("Error updating quote status: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to update quote status. ${errorMessage}` };
    }
}

export async function deleteQuoteRequest(id: string) {
    try {
        await deleteDoc(doc(db, 'quoteRequests', id));
        revalidatePath('/admin/quotes');
        return { success: true };
    } catch (error) {
        console.error("Error deleting quote request: ", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, message: `Failed to delete quote request. ${errorMessage}` };
    }
}


// Server action to seed the database
export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Seed services
    const servicesCol = collection(db, 'services');
    const servicesSnapshot = await getDocs(servicesCol);
    if (servicesSnapshot.empty) {
        mockServices.forEach(item => {
            const docRef = doc(servicesCol, item.id);
            batch.set(docRef, item);
        });
    }

    // Seed featuredProjects
    const projectsCol = collection(db, 'featuredProjects');
    const projectsSnapshot = await getDocs(projectsCol);
    if(projectsSnapshot.empty) {
        mockProjects.forEach(item => {
            const docRef = doc(projectsCol, item.id);
            batch.set(docRef, item);
        });
    }
    
    // Seed testimonials
    const testimonialsCol = collection(db, 'testimonials');
    const testimonialsSnapshot = await getDocs(testimonialsCol);
    if (testimonialsSnapshot.empty) {
        mockTestimonials.forEach(item => {
            const docRef = doc(testimonialsCol, item.id);
            batch.set(docRef, item);
        });
    }

    // Seed articles
    const articlesCol = collection(db, 'articles');
    const articlesSnapshot = await getDocs(articlesCol);
    if (articlesSnapshot.empty) {
        mockArticles.forEach(item => {
            const docRef = doc(articlesCol, item.id);
            batch.set(docRef, item);
        });
    }

    // Seed galleryImages
    const galleryCol = collection(db, 'galleryImages');
    const gallerySnapshot = await getDocs(galleryCol);
    if (gallerySnapshot.empty) {
        mockGalleryImages.forEach(item => {
            const docRef = doc(galleryCol, item.id);
            batch.set(docRef, item);
        });
    }
    
    // Seed events
    const eventsCol = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCol);
    if (eventsSnapshot.empty) {
        mockEvents.forEach(item => {
            const docRef = doc(eventsCol, item.id);
            batch.set(docRef, { ...item, created_at: new Date(item.created_at) });
        });
    }

    // Seed contactSubmissions
    const contactsCol = collection(db, 'contactSubmissions');
    const contactsSnapshot = await getDocs(contactsCol);
    if (contactsSnapshot.empty) {
        mockContactSubmissions.forEach(item => {
            const docRef = doc(contactsCol, item.id);
            batch.set(docRef, { ...item, created_at: new Date(item.created_at) });
        });
    }

    // Seed quoteRequests
    const quotesCol = collection(db, 'quoteRequests');
    const quotesSnapshot = await getDocs(quotesCol);
    if (quotesSnapshot.empty) {
        mockQuoteRequests.forEach(item => {
            const docRef = doc(quotesCol, item.id);
            batch.set(docRef, { ...item, createdAt: new Date() });
        });
    }

    await batch.commit();
    revalidatePath('/', 'layout');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Error seeding database: ${errorMessage}` };
  }
}

    