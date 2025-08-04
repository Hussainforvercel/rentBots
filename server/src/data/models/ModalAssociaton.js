import EmailToken from './EmailToken.js';
import User from './User.js';
import UserProfile from './UserProfile.js';
import UserVerifiedInfo from './UserVerifiedInfo.js';

// Define associations after both models are initialized

// User has one UserProfile
User.hasOne(UserProfile, {
    foreignKey: 'userId',
    as: 'profile',  // Alias for UserProfile association
    onUpdate: 'cascade',
    onDelete: 'cascade',
});

// UserProfile belongs to User
UserProfile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',  // Alias for UserProfile association
    onUpdate: 'cascade',
    onDelete: 'cascade',
});

// User has one UserVerifiedInfo
User.hasOne(UserVerifiedInfo, {
    foreignKey: 'userId',
    as: 'userVerifiedInfo',  // Alias for UserVerifiedInfo association
    onUpdate: 'cascade',
    onDelete: 'cascade',
});

// UserVerifiedInfo belongs to User
UserVerifiedInfo.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',  // Alias for UserVerifiedInfo association
    onUpdate: 'cascade',
    onDelete: 'cascade',
});

// User has many EmailTokens (one-to-many relationship)
User.hasMany(EmailToken, {
    foreignKey: 'userId',
    as: 'emailToken',  // Alias for the association
    onUpdate: 'cascade',
    onDelete: 'cascade',
});

// EmailToken belongs to User
EmailToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',  // Alias for the association
    onUpdate: 'cascade',
    onDelete: 'cascade',
});