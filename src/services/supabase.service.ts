import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

export const supabaseService = {
  // Clientes
  async getClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('estado', true)
    
    if (error) throw error
    return data
  },

  async getClienteById(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id_cliente', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createCliente(cliente: Database['public']['Tables']['clientes']['Insert']) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateCliente(id: string, cliente: Database['public']['Tables']['clientes']['Update']) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id_cliente', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Pólizas
  async getPolizas() {
    const { data, error } = await supabase
      .from('polizas')
      .select('*')
      .eq('estado', true)
    
    if (error) throw error
    return data
  },

  async getPolizaById(id: string) {
    const { data, error } = await supabase
      .from('polizas')
      .select('*')
      .eq('id_poliza', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createPoliza(poliza: Database['public']['Tables']['polizas']['Insert']) {
    const { data, error } = await supabase
      .from('polizas')
      .insert(poliza)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePoliza(id: string, poliza: Database['public']['Tables']['polizas']['Update']) {
    const { data, error } = await supabase
      .from('polizas')
      .update(poliza)
      .eq('id_poliza', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Plan de Pago
  async getPlanesDePago() {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .select('*, clientes(*), polizas(*)')
      .eq('estado', true)
    
    if (error) throw error
    return data
  },

  async getPlanDePagoById(id: string) {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .select('*, clientes(*), polizas(*)')
      .eq('id_plan', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createPlanDePago(plan: Database['public']['Tables']['plan_de_pago']['Insert']) {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .insert(plan)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePlanDePago(id: string, plan: Database['public']['Tables']['plan_de_pago']['Update']) {
    const { data, error } = await supabase
      .from('plan_de_pago')
      .update(plan)
      .eq('id_plan', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Storage
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return data
  },

  getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
} 