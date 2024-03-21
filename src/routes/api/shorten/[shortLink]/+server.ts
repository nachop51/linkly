import { deleteLink, getFullLink, updatePublicLink } from '$lib/server/mongo'
import { getUser } from '$lib/server/user'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals, params }) => {
	const { shortLink } = params

	const user = await getUser({ locals })
	const linkDoc = await getFullLink({ shortLink })

	if (linkDoc == null || (linkDoc.isPublic === false && user?.id !== linkDoc.ownerId)) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	return json({ ...linkDoc })
}

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const user = await getUser({ locals })

	if (user == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { shortLink } = params

	const link = await getFullLink({ shortLink })

	if (link == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	if (user.id !== link.ownerId) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await deleteLink({ linkId: link._id.toString() })

	if (!result) {
		return json({ error: 'Failed to delete link' }, { status: 500 })
	}

	return json({ success: true })
}

export const PATCH: RequestHandler = async ({ locals, request, params }) => {
	const user = await getUser({ locals })

	if (user == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { shortLink } = params
	const { isPublic } = (await request.json()) as { isPublic?: boolean }

	if (isPublic == null || typeof isPublic !== 'boolean') {
		return json({ error: 'No valid `isPublic` boolean provided' }, { status: 400 })
	}

	const link = await getFullLink({ shortLink })

	if (link == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	if (user.id !== link.ownerId) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await updatePublicLink({ linkId: link._id.toString(), isPublic })

	if (!result) {
		return json({ error: 'Failed to update link' }, { status: 500 })
	}

	return json({ success: true })
}
