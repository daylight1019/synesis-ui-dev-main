//Types
export const Types = {
    SETROLE: '@setRole',
    SETINIT: '@setInit',
    SETPROGRAM: '@setProgram',
    SETSTAKINGPROGRAM: '@setStakingProgram',
    SETPOOLFLAG: '@setPoolFlag'
}

//Reducer

const INITIAL_STATE = {
    role: 0,
    provider: null,
    user: null,
    admin: null,
    customer: null,
    customerB: null,
    architect: null,
    architectB: null,
    builder: null,
    validator: null,
    new_authority: null,
    SNS: null,
    program: null,
    stakingProgram: null,
    pool_flag: false,
    owner: null,
    architectToken: null,
    builderToken: null,
    validatorToken: null,
    mint: null,
    poolVault: null,
    adminkey: null

};

export default function reducer(
    state = INITIAL_STATE,
    { type, payload }
) {
    switch (type) {
        case Types.SETROLE:
            return { ...state, role: payload };
        case Types.SETINIT:
            return {
                ...state,
                provider: payload.provider, user: payload.user, admin: payload.admin,
                customer: payload.customer, customerB: payload.customerB,
                architect: payload.architect, architectB: payload.architectB,
                builder: payload.builder, validator: payload.validator,
                new_authority: payload.new_authority,
                SNS: payload.SNS, 
                program: payload.program,
                stakingProgram: payload.stakingProgram,
                owner: payload.owner,
                architectToken: payload.architectToken,
                builderToken: payload.builderToken,
                validatorToken: payload.validatorToken,
                mint: payload.mint,
                poolVault: payload.poolVault,
                adminkey: payload.adminkey
            };
        case Types.SETPROGRAM:
            return { ...state, program: payload };
        case Types.SETSTAKINGPROGRAM:
            return { ...state, stakingProgram: payload };
        case Types.SETPOOLFLAG:
            return { ...state, pool_flag: payload }
        default:
            return state;
    }
};

//ActionS
export const setPoolFlag = (pool_flag) => ({ type: Types.SETPOOLFLAG, payload: pool_flag })
export const setRole = (role) => ({ type: Types.SETROLE, payload: role })
export const setProgram = (program) => ({ type: Types.SETPROGRAM, payload: program })
export const setStakingProgram = (program) => ({ type: Types.SETSTAKINGPROGRAM, payload: program })
export const setInit = (provider, user, admin, customer, customerB, architect, architectB, builder, validator, new_authority, SNS, program, stakingProgram, owner, architectToken,
    builderToken, validatorToken, mint, poolVault, adminkey) => ({
        type: Types.SETINIT, payload: {
            provider, user, admin, customer, customerB, architect, architectB, builder, validator, new_authority, SNS, program, stakingProgram, owner, architectToken,
            builderToken, validatorToken, mint, poolVault, adminkey
        }
    })
