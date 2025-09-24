import axios from 'axios';

const api = axios.create({
	baseURL: '/api',
});

export const taskApi = {
	async list(params) {
		const { data } = await api.get('/tasks', { params });
		return data;
	},
	async create(payload) {
		const { data } = await api.post('/tasks', payload);
		return data;
	},
	async update(id, payload) {
		const { data } = await api.patch(`/tasks/${id}`, payload);
		return data;
	},
	async toggle(id) {
		const { data } = await api.post(`/tasks/${id}/toggle`);
		return data;
	},
	async remove(id) {
		await api.delete(`/tasks/${id}`);
	},
	async reorder(orderedIds) {
		const { data } = await api.post(`/tasks/reorder`, { orderedIds });
		return data.items;
	},
};

export default api;
