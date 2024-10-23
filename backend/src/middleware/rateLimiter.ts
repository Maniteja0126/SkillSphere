import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { message: 'Too many login attempts, please try again later.' }, 
    standardHeaders: true,
    legacyHeaders: false,

});

export const generalRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
});


