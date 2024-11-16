import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    Role: {
        type: String,
        required: true,
        unique: true, // Ensure roles are unique
        validate: {
            validator: function(value: string) {
                return /^(ADMIN|STAFF|USER|GUEST)+$/.test(value);
            },
            message: (props: { value: any; }) => `${props.value} is not a valid Role name. Valid roles are ADMIN, STAFF, USER, GUEST.`,
        },
    },
});

const RoleModel = mongoose.model('Role', roleSchema);

export default RoleModel;