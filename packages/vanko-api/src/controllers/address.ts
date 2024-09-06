import { IdParameter } from "@/schemas/index.ts";
import { ApiContext } from "@/types.ts";
import * as addressRepository from "@/models/address.ts";
import * as userRepository from "@/models/user.ts";
import { AddressCreateReq, AddressPatchReq } from "@/schemas/address.ts";
import { InsertAddress, UpdateAddress } from "@/models/types/address.ts";
import { InternalError, notFoundError } from "@/errors.ts";
import { Address, presentAddress } from "@/presenters.ts";

export async function byUser(ctx: ApiContext<{}, IdParameter, Array<Address>>) {
    if (!(await userRepository.findById(ctx.state.param.id))) {
        throw notFoundError("User not found");
    }

    const addresses = await addressRepository.belongingTo(ctx.state.param.id);

    ctx.status = 200;
    ctx.body = addresses.map((address) => presentAddress(address));
}

export async function create(
    ctx: ApiContext<AddressCreateReq, IdParameter, Address>
) {
    const created = await addressRepository.create(await toInsertObject(ctx));

    if (!created) {
        throw InternalError();
    }

    ctx.message = "Address created";
    ctx.body = presentAddress(created);
    ctx.status = 201;
}

export async function del(ctx: ApiContext<{}, IdParameter>) {
    const deleted = await addressRepository.del(ctx.state.param.id);

    if (!deleted) {
        throw notFoundError("Address not found");
    }

    ctx.status = 200;
    ctx.message = "Address deleted";
}
export async function patch(ctx: ApiContext<AddressPatchReq, IdParameter>) {
    const updated = await addressRepository.update(
        ctx.state.param.id,
        await toUpdateObject(ctx)
    );

    if (!updated) {
        throw notFoundError("Address not found");
    }

    ctx.status = 204;
    ctx.message = "Address updated";
}

async function toUpdateObject(
    ctx: ApiContext<AddressPatchReq, IdParameter>
): Promise<UpdateAddress> {
    const update: UpdateAddress = {};

    console.log("gets here");
    if (ctx.state.req.city) {
        update.city = (
            await addressRepository.insertCity({ name: ctx.state.req.city })
        )?.id;
    }

    if (ctx.state.req.country) {
        update.country = (
            await addressRepository.insertCountry({
                name: ctx.state.req.country
            })
        )?.id;
    }

    if (ctx.state.req.state) {
        update.state = (
            await addressRepository.insertState({ name: ctx.state.req.state })
        )?.id;
    }

    const {
        city: _city,
        state: _state,
        country: _coutry,
        ...rest
    } = ctx.state.req;

    return {
        ...rest,
        ...update
    };
}

async function toInsertObject(
    ctx: ApiContext<AddressCreateReq, IdParameter>
): Promise<InsertAddress> {
    const country = await addressRepository.insertCountry({
        name: ctx.state.req.country
    });
    const state = await addressRepository.insertState({
        name: ctx.state.req.state
    });
    const city = await addressRepository.insertCity({
        name: ctx.state.req.city
    });

    if (!city || !state || !country) {
        throw new Error(
            `Could not transform ${ctx.state.req} into a insert object`
        );
    }

    return {
        ...ctx.state.req,
        user: ctx.state.param.id,
        country: country.id,
        city: city.id,
        state: state.id
    };
}
